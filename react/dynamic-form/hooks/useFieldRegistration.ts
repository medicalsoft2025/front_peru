import { useEffect } from "react";
import { UseFormReturn, RegisterOptions } from "react-hook-form";
import { DynamicFormContainerConfig, DynamicFieldConfig } from "../interfaces/models";

interface UseFieldRegistrationProps {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<any>;
}

export const useFieldRegistration = ({ config, form }: UseFieldRegistrationProps) => {
    const { register } = form;

    useEffect(() => {
        const registerFields = (
            container: DynamicFormContainerConfig,
            parentPath: string = ""
        ) => {
            // Register direct fields
            if (container.fields) {
                container.fields.forEach((field) => {
                    const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;

                    // Build validation rules similar to DynamicField
                    const rules: RegisterOptions = {
                        required: field.required ? "Este campo es requerido" : false,
                        ...field.validation,
                    };

                    // Manually register the field with its rules
                    // This ensures RHF knows about the field and its validation requirements
                    // even if the component is not currently mounted (e.g. collapsed accordion)
                    register(fieldName, rules);
                });
            }

            // Recursively register children containers
            if (container.containers) {
                container.containers.forEach((child) => {
                    let childPath = parentPath;

                    if (child.type === "form" && child.name) {
                        childPath = parentPath ? `${parentPath}.${child.name}` : child.name;
                    }
                    else if (child.type === "array" && child.name) {
                        // For arrays, we can't easily pre-register items since they depend on runtime data length.
                        // However, arrays typically manage their own mounted state or use FieldArray.
                        // If an array is inside an accordion, and the accordion is closed...
                        // RHF's Controller for the FieldArray itself might be needed?
                        // Actually, useFieldArray usually keeps track. 
                        // But individual inputs inside array items might be unmounted.
                        // For now, let's skip dynamic array items registration as they are dynamic.
                        // We only register the array path itself if needed? No, array fields need registration per item.
                        // LIMITATION: This pre-registration mainly fixes static fields in hidden containers.
                        return;
                    }

                    registerFields(child, childPath);
                });
            }
        };

        registerFields(config);
    }, [config, register]);
};
