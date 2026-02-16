import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicCheckboxProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
}

const DebouncedCheckbox = ({
    field,
    controllerField,
    commonProps,
    fieldName
}: {
    field: DynamicFieldConfig;
    controllerField: any;
    commonProps: any;
    fieldName: string;
}) => {
    const { value, onChange } = useDebouncedChange({
        field,
        controllerField
    });

    return (
        <div className="d-flex align-items-center">
            <Checkbox
                {...commonProps}
                inputId={fieldName}
                checked={value || false}
                onChange={(e) => onChange(e.checked)}
                onBlur={controllerField.onBlur}
            />
            <label htmlFor={fieldName} className="form-label ml-2">
                {field.label}
                {field.required && <span className="required">*</span>}
            </label>
        </div>
    );
};

export const DynamicCheckbox = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps
}: DynamicCheckboxProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : false}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedCheckbox
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                    fieldName={fieldName}
                />
            )}
        />
    );
};
