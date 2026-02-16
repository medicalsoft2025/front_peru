import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicInputNumberProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
}

const DebouncedInputNumber = ({
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
        <InputNumber
            {...commonProps}
            className="w-100"
            value={value}
            mode="decimal"
            showButtons
            minFractionDigits={2}
            onValueChange={(e) => onChange(e.value)}
            onChange={(e) => onChange(e.value)}
            onBlur={controllerField.onBlur}
        />
    );
};

export const DynamicInputNumber = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps
}: DynamicInputNumberProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : 0}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedInputNumber
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                />
            )}
        />
    );
};
