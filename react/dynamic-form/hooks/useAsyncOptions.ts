import { useState, useEffect, useRef, useMemo } from "react";
import { useFormContext as useRHFFormContext, useWatch } from "react-hook-form";
import { AsyncOptionsConfig, AsyncParam } from "../interfaces/models";
import { getValueByPath } from "../../../services/utilidades";
import { useFormContext as useCustomFormContext } from "../context/FormContext";

interface UseAsyncOptionsProps {
    config?: AsyncOptionsConfig;
    fieldName: string;
}

export const useAsyncOptions = ({ config, fieldName }: UseAsyncOptionsProps) => {
    const { control, setValue, getValues } = useRHFFormContext();
    const { sources } = useCustomFormContext();
    const [options, setOptions] = useState<Array<{ label: string; value: any }>>([]);
    const [loading, setLoading] = useState(false);

    const resolveWildcardPath = (genericPath: string, specificFieldPath: string): string => {
        if (!genericPath.includes("*")) return genericPath;

        const genericParts = genericPath.split(".");
        const specificParts = specificFieldPath.split(".");

        // If wildcard structure doesn't match roughly, try best effort or return generic
        // Assuming genericPath and specificFieldPath align in hierarchy
        // OR, simply replace '*' with corresponding index from specificFieldPath if available

        return genericParts.map((part, index) => {
            if (part === "*" && specificParts[index]) {
                // If the specific part is a number (index), use it
                if (/^\d+$/.test(specificParts[index])) {
                    return specificParts[index];
                }
            }
            return part;
        }).join(".");
    };

    const rawDependencies = useMemo(() => {
        const deps = config?.params
            ?.filter(p => p.source === "field")
            .map(p => p.value) || [];

        if (config?.dependsOn && !deps.includes(config.dependsOn)) {
            deps.push(config.dependsOn);
        }
        return deps;
    }, [config]);

    const fieldDependencies = useMemo(() => {
        return rawDependencies.map((dep: string) => resolveWildcardPath(dep, fieldName));
    }, [rawDependencies, fieldName]);

    const watchedValues = useWatch({
        control,
        name: fieldDependencies,
    });

    const currentDependencyValues: Record<string, any> = {};
    if (fieldDependencies.length > 0) {
        fieldDependencies.forEach((depName: string, index: number) => {
            currentDependencyValues[depName] = Array.isArray(watchedValues)
                ? watchedValues[index]
                : watchedValues;
        });
    }

    const hasFetched = useRef(false);

    useEffect(() => {
        if (!config) return;

        if (config.dependsOn && (!currentDependencyValues[resolveWildcardPath(config.dependsOn, fieldName)])) {
            setOptions([]);
            return;
        }
        if (config.dependsOn && (!currentDependencyValues[resolveWildcardPath(config.dependsOn, fieldName)])) {
            setOptions([]);
            return;
        }

        const resolveParamValue = (param: AsyncParam) => {
            if (param.source === "static") return param.value;
            if (param.source === "url") {
                const searchParams = new URLSearchParams(window.location.search);
                return searchParams.get(param.value);
            }
            if (param.source === "field") {
                // Resolve the generic path (e.g. phones.*.country) to specific (phones.0.country)
                const resolvedKey = resolveWildcardPath(param.value, fieldName);
                return currentDependencyValues[resolvedKey];
            }
            return null;
        };

        const fetchOptions = async () => {
            setLoading(true);
            try {
                // NEW: Check if sourceKey is defined and a corresponding source exists
                if (config.sourceKey && sources && sources[config.sourceKey]) {
                    const fetcher = sources[config.sourceKey];

                    // Build params object for the custom fetcher
                    const fetcherParams: Record<string, any> = {};

                    if (config.params) {
                        config.params.forEach(param => {
                            const val = resolveParamValue(param);
                            if (val !== null && val !== undefined && val !== "") {
                                fetcherParams[param.key] = val;
                            }
                        });
                    }

                    if (config.dependsOn && config.paramKey) {
                        const val = currentDependencyValues[resolveWildcardPath(config.dependsOn, fieldName)];
                        if (val) fetcherParams[config.paramKey] = val;
                    }

                    // Call the custom fetcher
                    const data = await fetcher(fetcherParams);
                    const items = Array.isArray(data) ? data : [];

                    setOptions(items.map((item: any) => ({
                        label: getValueByPath(item, config.labelKey) || item[config.labelKey],
                        value: getValueByPath(item, config.valueKey) || item[config.valueKey],
                    })));

                } else if (config.endpoint) {
                    // EXISTING: Fetch from endpoint
                    let url = config.endpoint;
                    let queryParams = new URLSearchParams();
                    let bodyParams: Record<string, any> = {};

                    if (config.params) {
                        config.params.forEach(param => {
                            const val = resolveParamValue(param);
                            if (val === null || val === undefined || val === "") return;
                            const location = param.location || (config.method === "POST" ? "body" : "query");

                            if (location === "path") {
                                const placeholder = `:${param.key}`;
                                if (url.includes(placeholder)) {
                                    url = url.replace(placeholder, String(val));
                                } else {
                                    url = url.replace(/\/+$/, "");
                                    url = `${url}/${val}`;
                                }
                            } else if (location === "body") {
                                bodyParams[param.key] = val;
                            } else {
                                queryParams.append(param.key, String(val));
                            }
                        });
                    }

                    if (config.dependsOn && config.paramKey) {
                        const val = currentDependencyValues[resolveWildcardPath(config.dependsOn, fieldName)];
                        if (val) queryParams.append(config.paramKey, String(val));
                    }
                    const qs = queryParams.toString();
                    if (qs) {
                        url += (url.includes("?") ? "&" : "?") + qs;
                    }

                    const fetchOptions: RequestInit = {
                        method: config.method || "GET",
                        headers: {
                            "Content-Type": "application/json",
                            ...(config.headers || {}),
                        },
                    };

                    if (config.method === "POST" || config.method === "PUT") {
                        fetchOptions.body = JSON.stringify(bodyParams);
                    }

                    const response = await fetch(url, fetchOptions);
                    if (!response.ok) throw new Error("Error fetching options");

                    const data = await response.json();
                    const items = Array.isArray(data) ? data : [];

                    setOptions(items.map((item: any) => ({
                        label: getValueByPath(item, config.labelKey) || item[config.labelKey],
                        value: getValueByPath(item, config.valueKey) || item[config.valueKey],
                    })));
                }

            } catch (error) {
                console.error(error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        if (hasFetched.current) {
            if (fieldDependencies.length > 0) {
                setValue(fieldName, null);
            }
        }

        fetchOptions();
        hasFetched.current = true;

    }, [config?.endpoint, config?.sourceKey, JSON.stringify(currentDependencyValues), JSON.stringify(config?.params)]);

    return { options, loading };
};
