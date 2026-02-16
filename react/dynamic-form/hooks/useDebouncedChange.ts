import { useState, useEffect, useRef, useCallback } from "react";
import { ControllerRenderProps, FieldValues } from "react-hook-form";
import { DynamicFieldConfig } from "../interfaces/models";

interface UseDebouncedChangeProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    controllerField: ControllerRenderProps<T, any>;
}

export const useDebouncedChange = <T extends FieldValues>({
    field,
    controllerField,
}: UseDebouncedChangeProps<T>) => {
    const debounceTime =
        field.asyncValidation?.debounceTime ?? field.debounceTime ?? 0;

    const [value, setValue] = useState(controllerField.value);
    const debounceRef = useRef<number | null>(null);

    useEffect(() => {
        setValue(controllerField.value);
    }, [controllerField.value]);

    const handleChange = useCallback((
        newValue: any
    ) => {
        setValue(newValue);

        if (debounceTime > 0) {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                controllerField.onChange(newValue);
            }, debounceTime);
        } else {
            controllerField.onChange(newValue);
        }
    }, [controllerField, debounceTime]);

    return {
        value,
        onChange: handleChange,
    };
};
