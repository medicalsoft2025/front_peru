import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { Rating } from "primereact/rating";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicRatingProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
}

const DebouncedRating = ({
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
        <Rating
            {...commonProps}
            value={value}
            onChange={(e) => onChange(e.value)}
            onBlur={controllerField.onBlur}
        />
    );
};

export const DynamicRating = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps
}: DynamicRatingProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : null}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedRating
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                />
            )}
        />
    );
};
