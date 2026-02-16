import React, { useEffect } from "react";
import { UseFormReturn, FieldValues, useFieldArray } from "react-hook-form";
import { DynamicFormElementConfig } from "../../interfaces/models";
import { Button } from "primereact/button";
import { DynamicArrayItem } from "./DynamicArrayItem";
import { DynamicTableArray } from "./DynamicTableArray";

interface DynamicArrayContainerProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    form: UseFormReturn<T>;
    parentPath?: string;
}

export const DynamicArrayContainer = <T extends FieldValues>({
    config,
    form,
    parentPath = "",
}: DynamicArrayContainerProps<T>) => {
    const arrayName = parentPath ? `${parentPath}.${config.name}` : config.name;

    if (!arrayName) {
        console.error("DynamicArrayContainer: 'name' is required for array definitions.");
        return null;
    }

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: arrayName as any,
    });

    const { addLabel = "Agregar", removeLabel = "Eliminar", min = 0, max } = config.arrayConfig || {};

    useEffect(() => {
        if (config.initialValue && fields.length === 0) {
            if (fields.length < min) {
                const diff = min - fields.length;
                for (let i = 0; i < diff; i++) {
                    append({} as any);
                }
            }
        }
    }, [min, fields.length, append, config.initialValue]);

    if (config.arrayConfig?.format === "table") {
        return (
            <DynamicTableArray
                config={config}
                form={form}
                fields={fields}
                append={append}
                remove={remove}
                parentPath={arrayName}
            />
        );
    }

    return (
        <div className="d-flex flex-column gap-2 w-full">
            {config.label && (
                <div className="text-xl font-bold mb-2">{config.label}</div>
            )}

            {fields.map((field, index) => (
                <DynamicArrayItem
                    key={field.id}
                    config={config}
                    form={form}
                    index={index}
                    basePath={`${arrayName}.${index}`}
                    onRemove={remove}
                    removeLabel={removeLabel}
                />
            ))}

            <div className="d-flex justify-content-start mt-2">
                <Button
                    type="button"
                    label={addLabel}
                    icon={<i className="fa-solid fa-plus me-1"></i>}
                    onClick={() => append({} as any)}
                    disabled={max !== undefined && fields.length >= max}
                />
            </div>
        </div>
    );
};
