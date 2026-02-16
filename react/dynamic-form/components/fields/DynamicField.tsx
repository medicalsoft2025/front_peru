import React, { useContext, useMemo, useRef } from "react";
import {
    UseFormReturn,
    FieldValues,
    RegisterOptions,
} from "react-hook-form";
import { DynamicFieldConfig } from "../../interfaces/models";
import { getValueByPath } from "../../../../services/utilidades";
import { FormContext, FormContextValue } from "../../context/FormContext";
import { useVisibility } from "../../context/VisibilityContext";
import { DynamicInputText } from "./inputs/DynamicInputText";
import { DynamicSelect } from "./inputs/DynamicSelect";
import { DynamicMultiSelect } from "./inputs/DynamicMultiSelect";
import { DynamicCalendar } from "./inputs/DynamicCalendar";
import { DynamicCheckbox } from "./inputs/DynamicCheckbox";
import { DynamicRadio } from "./inputs/DynamicRadio";
import { DynamicInputNumber } from "./inputs/DynamicInputNumber";
import { DynamicInputTextarea } from "./inputs/DynamicInputTextarea";
import { DynamicColorPicker } from "./inputs/DynamicColorPicker";
import { DynamicEditor } from "./inputs/DynamicEditor";
import { DynamicTreeSelect } from "./inputs/DynamicTreeSelect";
import { DynamicChips } from "./inputs/DynamicChips";
import { DynamicRating } from "./inputs/DynamicRating";
import { DynamicSlider } from "./inputs/DynamicSlider";

interface DynamicFieldProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    parentPath?: string;
    className?: string;
    onElementSelect?: (config: DynamicFieldConfig | any) => void;
}

export const DynamicField = <T extends FieldValues>({
    field,
    form,
    parentPath = "",
    className = ""
}: DynamicFieldProps<T>) => {
    const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name || "";

    const {
        formState: { errors },
    } = form;

    const { fieldStates, onElementSelect, fieldSuggestions } = useContext(FormContext) as FormContextValue;
    const { isVisible: parentVisibility } = useVisibility();

    const fieldState = fieldStates[fieldName] || {
        visible: true,
        disabled: false,
    };

    const actualVisibility = fieldState.visible !== false && parentVisibility;

    React.useEffect(() => {
        form.trigger(fieldName as any);
    }, [actualVisibility, fieldName, form, field.required]);

    const validationCache = useRef<{ key: string; result: any } | null>(null);

    const validationRules = useMemo(() => {
        const rules: Omit<
            RegisterOptions<any, any>,
            "setValueAs" | "disabled" | "valueAsNumber" | "valueAsDate"
        > = {
            required: field.required ? "Este campo es requerido" : false,
            ...field.validation,
        };

        if (field.asyncValidation) {
            rules.validate = async (value: any) => {
                const config = field.asyncValidation!;
                const { endpoint, method = "POST", message = "Valor inválido", headers, params } = config;

                const currentDataMap: Record<string, any> = { value };
                let cacheKey = `${endpoint}|${value}`;

                if (params) {
                    params.forEach(param => {
                        let val: any = null;
                        if (param.source === "static") val = param.value;
                        else if (param.source === "url") {
                            const searchParams = new URLSearchParams(window.location.search);
                            val = searchParams.get(param.value);
                        } else if (param.source === "field") {
                            val = form.getValues(param.value as any);
                        }

                        if (val !== undefined && val !== null) {
                            currentDataMap[param.key] = val;
                            cacheKey += `|${param.key}:${val}`;
                        }
                    });
                }

                if (validationCache.current && validationCache.current.key === cacheKey) {
                    return validationCache.current.result;
                }

                try {
                    let url = endpoint;
                    let queryParams = new URLSearchParams();
                    let bodyParams: Record<string, any> = { value };

                    if (params) {
                        params.forEach(param => {
                            const val = currentDataMap[param.key];
                            if (val === null || val === undefined || val === "") return;

                            const location = param.location || (method === "POST" ? "body" : "query");

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

                    const qs = queryParams.toString();
                    if (qs) {
                        url += (url.includes("?") ? "&" : "?") + qs;
                    }

                    const fetchOptions: RequestInit = {
                        method,
                        headers: {
                            "Content-Type": "application/json",
                            ...(headers || {})
                        },
                        body: (method === "POST" || method === "PUT") ? JSON.stringify(bodyParams) : undefined
                    };

                    const response = await fetch(url, fetchOptions);

                    if (!response.ok) {
                        return message;
                    } else {
                        const data = await response.json();
                        if (data.valid === false) return data.message || message;
                    }

                    validationCache.current = { key: cacheKey, result: true };
                    return true;

                } catch (e) {
                    console.error(e);
                    return "Error de validación";
                }
            }
        }
        return rules;
    }, [
        field,
        field.required,
        field.validation,
        field.asyncValidation,
        field.validation?.pattern,
        field.validation?.min,
        field.validation?.max,
        field.validation?.minLength,
        field.validation?.maxLength,
        form.getValues
    ]);

    const commonProps = {
        id: fieldName,
        disabled: field.disabled || fieldState.disabled || !actualVisibility,
        placeholder: field.placeholder,
    };

    const renderController = () => {
        switch (field.type) {
            case "select":
                return (
                    <DynamicSelect
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                        options={fieldState.options}
                    />
                )
            case "tree-select":
                return (
                    <DynamicTreeSelect
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                        options={fieldState.treeOptions}
                    />
                )
            case "text":
            case undefined:
                return (
                    <DynamicInputText
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        type="text"
                        commonProps={commonProps}
                    />
                );
            case "email":
                return (
                    <DynamicInputText
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={{
                            ...validationRules,
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Email inválido",
                            },
                        }}
                        type="email"
                        commonProps={commonProps}
                    />
                );
            case "password":
                return (
                    <DynamicInputText
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        type="password"
                        commonProps={commonProps}
                    />
                );
            case "multiselect":
                return (
                    <DynamicMultiSelect
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "date":
            case "datetime":
                return (
                    <DynamicCalendar
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "checkbox":
                return (
                    <DynamicCheckbox
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "radio":
                return (
                    <DynamicRadio
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "number":
                return (
                    <DynamicInputNumber
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "textarea":
                return (
                    <DynamicInputTextarea
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "colorpicker":
                return (
                    <DynamicColorPicker
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "editor":
                return (
                    <DynamicEditor
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "chips":
                return (
                    <DynamicChips
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "rating":
                return (
                    <DynamicRating
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );

            case "slider":
                return (
                    <DynamicSlider
                        field={field}
                        form={form}
                        fieldName={fieldName}
                        validationRules={validationRules}
                        commonProps={commonProps}
                    />
                );
            default:
                return null;
        }
    };

    const getFormErrorMessage = (name: string) => {
        const fieldErrors = getValueByPath(errors, name);
        return (
            fieldErrors && (
                <small className="p-error">
                    {fieldErrors.message?.toString()}
                </small>
            )
        );
    };

    const handleFieldClick = (e: React.MouseEvent) => {
        if (onElementSelect) {
            e.stopPropagation();
            onElementSelect(field);
        }
    };

    return (
        <div
            className={`dynamic-field ${className}`}
            onClick={handleFieldClick}
            style={{ display: actualVisibility ? 'block' : 'none' }}
        >
            {field.label &&
                !["checkbox", "radio"].includes(field.type || "") && (
                    <label htmlFor={fieldName} className="form-label">
                        {field.label}
                        {field.required && <span className="required">*</span>}
                    </label>
                )}

            {renderController()}

            {getFormErrorMessage(fieldName)}

            {/* AI Suggestions Rendering */}
            {fieldSuggestions && fieldSuggestions[fieldName] && fieldSuggestions[fieldName].length > 0 && (
                <div className="field-suggestions mt-1 d-flex flex-wrap gap-2">
                    <small className="text-muted w-100 mb-1">
                        <i className="fa fa-magic me-1"></i>Sugerencias IA:
                    </small>
                    {fieldSuggestions[fieldName].map((suggestion: string | any, idx: number) => (
                        <span
                            key={idx}
                            className="badge bg-light text-dark border cursor-pointer hover-shadow"
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                                e.stopPropagation();
                                form.setValue(fieldName as any, suggestion, { shouldValidate: true, shouldDirty: true });
                            }}
                        >
                            {typeof suggestion === 'object' ? JSON.stringify(suggestion) : suggestion}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};
