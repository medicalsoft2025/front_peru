import { DynamicFormElementConfig } from "../interfaces/models";
import { FieldValues, useFormContext as useRHFContext } from "react-hook-form";
import { getValueByPath } from "../../../services/utilidades";

interface UseContainerErrorsProps {
    config: DynamicFormElementConfig;
    parentPath?: string;
}

export const useContainerErrors = ({ config, parentPath = "" }: UseContainerErrorsProps) => {
    const { formState: { errors } } = useRHFContext<FieldValues>();

    const getContainerPath = (): string => {
        if (config.type === "form" && config.name) {
            return parentPath ? `${parentPath}.${config.name}` : config.name;
        }
        return parentPath;
    };

    const containerPath = getContainerPath();

    const hasErrors = (): boolean => {
        const checkErrors = (
            container: DynamicFormElementConfig,
            currentPath: string
        ): boolean => {
            let foundError = false;

            const allElements = [
                ...(container.children || []),
                ...(container.fields || []),
                ...(container.containers || [])
            ];

            foundError = allElements.some(element => {
                const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(element.type);

                if (isContainer) {
                    let childPath = currentPath;
                    if (element.type === "form" && element.name) {
                        childPath = currentPath ? `${currentPath}.${element.name}` : element.name;
                    }

                    if (element.type === "array" && element.name) {
                        const arrayPath = currentPath ? `${currentPath}.${element.name}` : element.name;
                        const arrayErrors = getValueByPath(errors, arrayPath);
                        return Array.isArray(arrayErrors) && arrayErrors.length > 0;
                    }

                    return checkErrors(element, childPath);
                } else {
                    const fieldName = currentPath ? `${currentPath}.${element.name}` : element.name;
                    return !!getValueByPath(errors, fieldName);
                }
            });

            return foundError;
        };

        return checkErrors(config, containerPath);
    };

    return { hasErrors: hasErrors() };
};
