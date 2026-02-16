import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicColorPickerProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
}

const DebouncedColorPicker = ({
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
        <div className="d-flex align-items-center gap-2">
            <ColorPicker
                {...commonProps}
                value={value}
                onChange={(e) => onChange(e.value)}
                onBlur={controllerField.onBlur}
            />
            <InputText
                {...commonProps}
                className="w-100"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onBlur={controllerField.onBlur}
            />
        </div>
    );
};

export const DynamicColorPicker = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps
}: DynamicColorPickerProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : ""}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedColorPicker
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                />
            )}
        />
    );
};
