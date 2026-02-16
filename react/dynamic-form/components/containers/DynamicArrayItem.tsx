import React from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { DynamicFormElementConfig } from "../../interfaces/models";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { Button } from "primereact/button";
import { useFieldConditions } from "../../hooks/useFieldConditions";
import { useFormContext } from "../../context/FormContext";
import { FormProvider } from '../../providers/FormProvider'
import { useDynamicFormContainer } from "../../hooks/useDynamicFormContainer";
import { DynamicField } from "../fields/DynamicField";

interface DynamicArrayItemProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    form: UseFormReturn<T>;
    index: number;
    basePath: string;
    onRemove: (index: number) => void;
    removeLabel?: string;
}

export const DynamicArrayItem = <T extends FieldValues>({
    config,
    form,
    index,
    basePath,
    onRemove,
    removeLabel = "Eliminar",
}: DynamicArrayItemProps<T>) => {
    const { fieldStates } = useFieldConditions({
        config,
        form,
        basePath: basePath,
    });

    const {
        hasFields,
        hasContainers,
        shouldRenderFields,
    } = useDynamicFormContainer({
        config,
        form,
        parentPath: basePath,
    });

    const parentContext = useFormContext();

    const mergedFieldStates = {
        ...parentContext.fieldStates,
        ...fieldStates,
    };

    return (
        <div className="d-flex flex-column gap-3 mb-4 p-3 border rounded">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold fs-7">
                    #{index + 1}
                </span>
                <Button
                    type="button"
                    icon={<i className="fa-solid fa-trash"></i>}
                    className="p-button-danger"
                    onClick={() => onRemove(index)}
                    tooltip={removeLabel}
                />
            </div>

            <FormProvider value={{
                fieldStates: mergedFieldStates,
                form: form as UseFormReturn<FieldValues>,
                setFieldState: parentContext.setFieldState,
                onElementSelect: parentContext.onElementSelect,
            }}>
                <div className={config.contentStyleClass}>
                    {(config.children || config.containers || config.fields)?.map((child, index) => {
                        const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(child.type);
                        if (isContainer) {
                            return (
                                <DynamicFormContainer
                                    key={child.name || `container-${index}`}
                                    config={child}
                                    form={form}
                                    parentPath={basePath}
                                    className={child.styleClass}
                                />
                            );
                        } else {
                            return (
                                <DynamicField
                                    key={child.name}
                                    field={child}
                                    form={form as UseFormReturn<FieldValues>}
                                    parentPath={basePath}
                                    className={child.styleClass}
                                />
                            );
                        }
                    })}
                </div>
            </FormProvider>
        </div>
    );
};
