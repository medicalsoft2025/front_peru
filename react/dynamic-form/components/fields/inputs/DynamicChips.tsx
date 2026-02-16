import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { Chips } from "primereact/chips";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicChipsProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
}

const DebouncedChips = ({
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
        <Chips
            {...commonProps}
            value={value}
            onChange={(e) => onChange(e.value)}
            onBlur={controllerField.onBlur}
            className="w-100"
            pt={{
                root: {
                    className: "w-100"
                },
                container: {
                    className: "w-100"
                }
            }}
        />
    );
};

export const DynamicChips = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps
}: DynamicChipsProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : null}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedChips
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                />
            )}
        />
    );
};
