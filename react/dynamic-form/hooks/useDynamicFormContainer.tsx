import { useMemo, useEffect } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { DynamicFormContainerConfig } from "../interfaces/models";

interface UseDynamicFormContainerProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    parentPath?: string;
}

interface UseDynamicFormContainerReturn {
    getActualFormGroupPath: () => string;
    actualFormGroup: string;
    containerType: string;
    hasFields: boolean;
    hasContainers: boolean;
    hasChildren: boolean;
    shouldRenderFields: boolean;
    shouldRenderChildren: boolean;
    shouldRenderDivider: boolean;
}

export function useDynamicFormContainer<T extends FieldValues>({
    config,
    form,
    parentPath = "",
}: UseDynamicFormContainerProps<T>): UseDynamicFormContainerReturn {
    const containerType = config.type || "default";

    const getActualFormGroupPath = (): string => {
        if (config.type === "form" && config.name) {
            return parentPath ? `${parentPath}.${config.name}` : config.name;
        }
        return parentPath;
    };

    const actualFormGroupPath = getActualFormGroupPath();

    const hasFields = useMemo(
        () => (config.children !== undefined)
            ? config.children.some(c => !["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(c.type))
            : (!!config.fields && config.fields.length > 0),
        [config.fields, config.children]
    );

    const hasContainers = useMemo(
        () => (config.children !== undefined)
            ? config.children.some(c => ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(c.type))
            : (!!config.containers && config.containers.length > 0),
        [config.containers, config.children]
    );

    const hasChildren = useMemo(
        () => config.children !== undefined,
        [config.children]
    );

    const shouldRenderFields = hasFields;
    const shouldRenderChildren = hasChildren;
    const shouldRenderDivider = !!config.divider;

    useEffect(() => {
        form.trigger();
    }, []);

    return {
        getActualFormGroupPath,
        actualFormGroup: actualFormGroupPath,
        containerType,
        hasFields,
        hasContainers,
        hasChildren,
        shouldRenderFields,
        shouldRenderChildren,
        shouldRenderDivider,
    };
}
