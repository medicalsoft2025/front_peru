import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";

interface DynamicCalendarProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
}

const DebouncedCalendar = ({
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
        <Calendar
            {...commonProps}
            value={value}
            showIcon
            className="w-100"
            dateFormat={field.format || "dd/mm/yy"}
            showTime={field.type === "datetime"}
            hourFormat="12"
            onChange={(e) => onChange(e.value)}
            onBlur={controllerField.onBlur}
            selectionMode={field.calendarMode || "single"}
        />
    );
};

export const DynamicCalendar = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps
}: DynamicCalendarProps<T>) => {
    const { control } = form;

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value !== undefined ? field.value : null}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (
                <DebouncedCalendar
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                />
            )}
        />
    );
};
