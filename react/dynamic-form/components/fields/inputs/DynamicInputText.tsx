import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicInputTextProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    type?: string;
    commonProps?: any;
}

const DebouncedInputText = ({
    field,
    controllerField,
    commonProps,
    type
}: {
    field: DynamicFieldConfig;
    controllerField: any;
    commonProps: any;
    type: string;
}) => {
    const { value, onChange } = useDebouncedChange({
        field,
        controllerField
    });

    return (
        <InputText
            {...commonProps}
            className="w-100"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={controllerField.onBlur}
            type={type}
        />
    );
};

export const DynamicInputText = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    type = "text",
    commonProps
}: DynamicInputTextProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : ""}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedInputText
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                    type={type}
                />
            )}
        />
    );
};
