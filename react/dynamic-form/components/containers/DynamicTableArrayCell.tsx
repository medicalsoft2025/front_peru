import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { DynamicFormContainerConfig, DynamicFieldConfig } from "../../interfaces/models";
import { DynamicField } from "../fields/DynamicField";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { useFieldConditions } from "../../hooks/useFieldConditions";
import { useFormContext } from "../../context/FormContext";
import { FormProvider } from '../../providers/FormProvider';

interface DynamicTableArrayCellProps<T extends FieldValues> {
    config: DynamicFormContainerConfig; // The array config (for context if needed? NO, we need column config)
    colNode: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    basePath: string;
    index: number; // Real index
}

export const DynamicTableArrayCell = <T extends FieldValues>({
    colNode,
    form,
    basePath,
    index
}: DynamicTableArrayCellProps<T>) => {

    const { fieldStates } = useFieldConditions({
        config: colNode, // We only check rules inside this cell's config
        form,
        basePath,
    });

    const parentContext = useFormContext();

    const mergedFieldStates = {
        ...parentContext.fieldStates,
        ...fieldStates,
    };

    return (
        <FormProvider value={{
            fieldStates: mergedFieldStates,
            form: form,
            setFieldState: parentContext.setFieldState
        }}>
            <div className={`dynamic-container-cell ${colNode.styleClass || ""}`}>
                <DynamicFormContainer
                    config={colNode}
                    form={form}
                    parentPath={basePath}
                    className="w-full"
                />
            </div>
        </FormProvider>
    );
};
