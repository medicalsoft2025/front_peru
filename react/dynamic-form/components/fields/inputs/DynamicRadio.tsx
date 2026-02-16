import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { RadioButton } from "primereact/radiobutton";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicRadioProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
}

const DebouncedRadio = ({
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
        <div className="d-flex flex-column gap-2">
            {field.options?.map((option, index) => (
                <div key={index} className="d-flex align-items-center gap-2">
                    <RadioButton
                        {...commonProps}
                        inputId={`${fieldName}-${index}`}
                        name={fieldName}
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => {
                            if (e.checked) onChange(option.value);
                        }}
                        onBlur={controllerField.onBlur}
                    />
                    <label htmlFor={`${fieldName}-${index}`} className="ml-2">
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );
};

export const DynamicRadio = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps
}: DynamicRadioProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : ""}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedRadio
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                    fieldName={fieldName}
                />
            )}
        />
    );
};
