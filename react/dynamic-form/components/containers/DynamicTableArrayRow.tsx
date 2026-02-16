import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { DynamicFormContainerConfig } from "../../interfaces/models";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { useFieldConditions } from "../../hooks/useFieldConditions";
import { useFormContext } from "../../context/FormContext";
import { FormProvider } from '../../providers/FormProvider';
import { Column } from "primereact/column";

interface DynamicTableArrayRowProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    basePath: string;
}

export const DynamicTableArrayRow = <T extends FieldValues>({
    config,
    form,
    basePath
}: DynamicTableArrayRowProps<T>) => {

    const { fieldStates } = useFieldConditions({
        config,
        form,
        basePath,
    });

    const parentContext = useFormContext();

    const mergedFieldStates = {
        ...parentContext.fieldStates,
        ...fieldStates,
    };

    const cellBodyTemplate = (colNode: DynamicFormContainerConfig, index: number) => (rowData: any) => {
        return (
            <DynamicFormContainer
                config={colNode}
                form={form}
                parentPath={`${basePath}.${index}`}
                className="w-full"
            />
        );
    };

    console.log(config.containers);

    return (
        <FormProvider value={{
            fieldStates: mergedFieldStates,
            form: form,
            setFieldState: parentContext.setFieldState
        }}>
            {config?.containers?.map((col, i) => {
                const key = col.name || `col-${i}`;
                const header = col.label || col.name || `Col ${i + 1}`;
                const fieldName = col.name;

                return (
                    <Column
                        key={key}
                        header={header}
                        body={cellBodyTemplate(col, i)}
                        style={{ minWidth: '150px' }}
                        field={fieldName}
                    />
                )
            })}

        </FormProvider>
    );
};
