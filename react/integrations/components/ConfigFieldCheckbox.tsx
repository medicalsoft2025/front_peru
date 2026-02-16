import React, { useEffect, useState } from "react";
import { DynamicConfigFieldProps } from "../interfaces";
import { Checkbox } from "primereact/checkbox";

export const ConfigFieldCheckbox = (props: DynamicConfigFieldProps) => {
    const { field, label, initialValue, onChange } = props;

    const [value, setValue] = useState<boolean>(false);

    const handleValueChange = (e: any) => {
        setValue(e.target.checked);
        onChange(e.target.checked);
    };

    useEffect(() => {
        if (initialValue) {
            setValue(initialValue);
        }
    }, [initialValue]);

    return (
        <>
            <div className="d-flex align-items-center">
                <Checkbox
                    inputId={field}
                    checked={value}
                    onChange={handleValueChange}
                />
                <label htmlFor={label} className="form-label ml-2">
                    {label}
                </label>
            </div>
        </>
    );
};