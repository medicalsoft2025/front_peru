import React from "react";
import { Controller, FieldPath, RegisterOptions, UseFormReturn, FieldValues } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { DynamicFieldConfig } from "../../../interfaces/models";
import { useAsyncOptions } from "../../../hooks/useAsyncOptions";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange";
import { CascadeSelect } from 'primereact/cascadeselect';


interface DynamicCascadeSelectProps<T extends FieldValues> {
    field: DynamicFieldConfig;
    form: UseFormReturn<T>;
    fieldName: string;
    validationRules?: any;
    commonProps?: any;
    options?: Array<{ label: string; value: any }>; // Direct options override (e.g. from conditions)
}

const DebouncedCascadeSelect = ({
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
        <CascadeSelect
            {...commonProps}
            value={value}
            onChange={(e) => onChange(e.value)}
            options={finalOptions}
            optionLabel="label"
            optionValue="value"
            optionGroupLabel="label"
            optionGroupChildren={['states', 'cities']} //--
            panelStyle={{ maxWidth: '300px', minWidth: '300px !important' }}
            className="w-100"
            loading={loading}
            disabled={commonProps.disabled || loading}
            placeholder={loading ? "Cargando..." : commonProps.placeholder}
        />
    </>);
};

export const DynamicCascadeSelect = <T extends FieldValues>({
    field,
    form,
    fieldName,
    validationRules,
    commonProps,
    options: propOptions // Rename to avoid name collision
}: DynamicCascadeSelectProps<T>) => {
    const { control } = form;

    // Merge options: props > async > static config
    const finalOptions = (propOptions && propOptions.length > 0)
        ? propOptions : field.cascadeOptions || [];

    const emptyMessage = "No hay opciones disponibles";

    return (
        <Controller
            name={fieldName as FieldPath<T>}
            control={control}
            rules={validationRules}
            defaultValue={field.value}
            render={({ field: controllerField }) => (<>
                <div className="w-100">
                    <DebouncedCascadeSelect
                        field={field}
                        controllerField={controllerField}
                        commonProps={commonProps}
                        finalOptions={finalOptions}
                        loading={false}
                        emptyMessage={emptyMessage}
                    />
                </div>
            </>)}
        />
    );
};
