import React, { useContext } from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";
import { useAsyncOptions } from "../../../hooks/useAsyncOptions";

interface DynamicMultiSelectProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
    options?: Array<{ label: string; value: any }>;
}

const DebouncedMultiSelect = ({
    field,
    controllerField,
    commonProps,
    finalOptions,
    loading,
    emptyMessage
}: {
    field: DynamicFieldConfig;
    controllerField: any;
    commonProps: any;
    finalOptions: any[];
    loading: boolean;
    emptyMessage: string;
}) => {
    const { value, onChange } = useDebouncedChange({
        field,
        controllerField
    });

    return (
        <MultiSelect
            {...commonProps}
            value={value || []}
            options={finalOptions}
            className="w-100"
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange(e.value)}
            onBlur={controllerField.onBlur}
            display="chip"
            disabled={commonProps.disabled || loading}
            placeholder={loading ? "Cargando..." : commonProps.placeholder}
            emptyMessage={emptyMessage}
        />
    );
};

export const DynamicMultiSelect = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps,
    options: propOptions
}: DynamicMultiSelectProps<T>) => {
    const { control } = form;

    const { options: asyncOptions, loading } = useAsyncOptions({
        config: field.asyncOptions,
        fieldName
    });

    const finalOptions = (propOptions && propOptions.length > 0)
        ? propOptions
        : (asyncOptions && asyncOptions.length > 0)
            ? asyncOptions
            : field.options || [];

    const emptyMessage = loading ? "Cargando..." : "No hay opciones disponibles";

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : []}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedMultiSelect
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                    finalOptions={finalOptions}
                    loading={loading}
                    emptyMessage={emptyMessage}
                />
            )}
        />
    );
};
