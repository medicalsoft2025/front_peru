import React from "react";
import { Card } from "primereact/card";
import { DynamicFormContainerConfig } from "../../interfaces/models";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { UseFormReturn } from "react-hook-form";
import { FieldValues } from "react-hook-form";
import { useContainerErrors } from "../../hooks/useContainerErrors";
import { useDynamicFormContainer } from "../../hooks/useDynamicFormContainer";
import { DynamicField } from "../fields/DynamicField";

interface DynamicCardProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    actualFormGroup: string;
}

export const DynamicCard = <T extends FieldValues>({
    config,
    form,
    actualFormGroup
}: DynamicCardProps<T>) => {
    const {
        hasFields,
        hasContainers,
        shouldRenderFields,
    } = useDynamicFormContainer({
        config,
        form: form,
        parentPath: actualFormGroup,
    });

    const header = (
        <div className="d-flex justify-content-between align-items-center mb-0 p-2">
            <span className="font-bold text-xl">{config.label}</span>
        </div>
    );

    if (!hasFields && !hasContainers) return null;

    return (
        <Card title={config.label ? header : null} className={`shadow-1 ${config.styleClass}`}>
            <div className={config.contentStyleClass}>
                {(config.children || config.containers || config.fields)?.map((child, index) => {
                    const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(child.type);
                    if (isContainer) {
                        return (
                            <DynamicFormContainer
                                key={child.name || `container-${index}`}
                                config={child}
                                form={form}
                                parentPath={actualFormGroup}
                                className={child.styleClass}
                            />
                        );
                    } else {
                        return (
                            <DynamicField
                                key={child.name}
                                field={child}
                                form={form as UseFormReturn<FieldValues>}
                                parentPath={actualFormGroup}
                                className={child.styleClass}
                            />
                        );
                    }
                })}
            </div>
        </Card>
    );
};
