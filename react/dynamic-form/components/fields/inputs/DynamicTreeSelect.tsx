import React from "react";
import { Controller, FieldPath, UseFormReturn, FieldValues } from "react-hook-form";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";
import { TreeSelect } from "primereact/treeselect";
import { TreeNode } from "primereact/treenode";


interface DynamicTreeSelectProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
    options?: TreeNode[];
}

const DebouncedTreeSelect = ({
    field,
    controllerField,
    commonProps,
    finalOptions,
    loading,
    emptyMessage
}: {
    field: DynamicFieldConfig;
    controllerField: any;
    commonProps: any;
    finalOptions: any[];
    loading: boolean;
    emptyMessage: string;
}) => {
    const { value, onChange } = useDebouncedChange({
        field,
        controllerField
    });

    return (<>
        <TreeSelect
            {...commonProps}
            value={value}
            onChange={(e) => onChange(e.value)}
            options={finalOptions}
            disabled={commonProps.disabled || loading}
            placeholder={loading ? "Cargando..." : commonProps.placeholder}
            className="w-100"
        />
    </>);
};

export const DynamicTreeSelect = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps,
    options: propOptions
}: DynamicTreeSelectProps<T>) => {
    const { control } = form;

    const finalOptions = (propOptions && propOptions.length > 0)
        ? propOptions : field.treeOptions || [];

    const emptyMessage = "No hay opciones disponibles";

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value}
            disabled={commonProps.disabled}
            render={({ field: controllerField }) => (<>
                <DebouncedTreeSelect
                    field={field}
                    controllerField={controllerField}
                    commonProps={commonProps}
                    finalOptions={finalOptions}
                    loading={false}
                    emptyMessage={emptyMessage}
                />
            </>)}
        />
    );
};
