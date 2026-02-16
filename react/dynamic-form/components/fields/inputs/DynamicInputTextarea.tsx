import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicInputTextareaProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
}

const DebouncedInputTextarea = ({
    field,
    controllerField,
    commonProps
}: {
    field: DynamicFieldConfig;
    controllerField: any;
    commonProps: any;
}) => {
    const { value, onChange } = useDebouncedChange({
        field,
        controllerField
    });

    return (
        <InputTextarea
            {...commonProps}
            className="w-100"
            value={value}
            rows={field.rows || 4}
            onChange={(e) => onChange(e.target.value)}
            onBlur={controllerField.onBlur}
        />
    );
};

export const DynamicInputTextarea = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps
}: DynamicInputTextareaProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : ""}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedInputTextarea
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                />
            )}
        />
    );
};
