import { useState, useEffect, useRef, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AsyncOptionsConfig } from "../interfaces/models";

interface UseAsyncOptionsProps {
    config?: AsyncOptionsConfig;
    fieldName: string; // Needed if we want to reset val on depend change?
}

export const useAsyncOptions = ({ config, fieldName }: UseAsyncOptionsProps) => {
    const { control, setValue } = useFormContext();
    const [options, setOptions] = useState<Array<{ label: string; value: any }>>([]);
    const [loading, setLoading] = useState(false);

    console.log("config", config);
    console.log("fieldName", fieldName);

    // Dependency watching
    const dependencyValue = useWatch({
        control,
        name: config?.dependsOn || "",
        disabled: !config?.dependsOn,
    });

    // Ref to track if we have fetched for current dependency to avoid double fetch
    // or to handle "initial load" logic.
    const hasFetched = useRef(false);

    useEffect(() => {
        console.log("dependencyValue", dependencyValue);
        console.log("config", config);

        if (!config) return;

        // If dependsOn is set but no value, clear options and return
        if (config.dependsOn && (dependencyValue === undefined || dependencyValue === null || dependencyValue === "")) {
            setOptions([]);
            return;
        }

        const fetchOptions = async () => {
            setLoading(true);
            try {
                // Construct URL
                let url = config.endpoint;
                // If there's a paramKey and dependency value, append logic
                // This is a simple implementation: ?paramKey=value or /value if paramKey is absent?
                // Let's assume ?paramKey=value for now as per common patterns.
                // Or maybe the user puts placeholder in endpoint string? 

                // Let's support query param style for now:
                if (config.dependsOn && config.paramKey) {
                    const separator = url.includes("?") ? "&" : "?";
                    url = `${url}${separator}${config.paramKey}=${encodeURIComponent(dependencyValue)}`;
                }

                const response = await fetch(url, {
                    method: config.method || "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(config.headers || {}),
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch options");
                }

                const data = await response.json();

                // Transform data based on labelKey and valueKey
                // Assuming data is an array. If it's inside a property (e.g. data.results), we might need more config.
                // For now assuming data is Record<string, any>[]

                // Safety check if data is array
                const items = Array.isArray(data) ? data : [];

                const transformed = items.map((item: any) => ({
                    label: item[config.labelKey],
                    value: item[config.valueKey],
                }));

                setOptions(transformed);

            } catch (error) {
                console.error("Error fetching async options:", error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        // If it depends on something, we reset the current field value because options changed
        // UNLESS it's the very first mount and we might have a pre-filled value? 
        // For cascading, usually you want to reset child if parent changes.
        if (config.dependsOn && hasFetched.current) {
            setValue(fieldName, null); // Reset value
        }

        fetchOptions();
        hasFetched.current = true;

    }, [config?.endpoint, dependencyValue, config]);

    return { options, loading };
};
