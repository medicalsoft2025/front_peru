import React, { useState } from "react";
import { DynamicConfigFieldProps } from "../interfaces";
import { InputTextarea } from "primereact/inputtextarea";

export const ConfigFieldTextArea = (props: DynamicConfigFieldProps) => {
    const { field, label, initialValue, onChange } = props;

    const [value, setValue] = useState(initialValue || "");

    const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
        onChange(e.target.value);
    };

    return (
        <>
            <label htmlFor={field} className="form-label">{label}</label>
            <InputTextarea
                id={field}
                name={field}
                value={value}
                onChange={handleValueChange}
                className="w-100"
            />
        </>
    );
};