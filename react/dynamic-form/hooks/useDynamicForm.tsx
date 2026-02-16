import { Ref, useEffect, useImperativeHandle } from "react";
import { useForm, UseFormReturn, FieldValues } from "react-hook-form";
import { DynamicFormContainerConfig } from "../interfaces/models";
import { DynamicFormRef } from "../components/DynamicForm";

interface UseDynamicFormProps {
    config: DynamicFormContainerConfig;
    onSubmit: (data: any) => void;
    ref: Ref<DynamicFormRef>;
    data?: any | null;
    onChange?: (data: any) => void;
    setFormInvalid?: (invalid: boolean) => void;
}

interface UseDynamicFormReturn<T extends FieldValues> {
    form: UseFormReturn<T>;
    emitSubmitData: () => void;
}

export function useDynamicForm<T extends FieldValues>({
    config,
    onSubmit,
    ref,
    data,
    onChange,
    setFormInvalid,
}: UseDynamicFormProps): UseDynamicFormReturn<T> {
    const form = useForm({
        mode: "onChange",
        defaultValues: data || {},
        shouldUnregister: false,
        reValidateMode: "onChange",
    });

    const emitSubmitData = () => {
        onSubmit(form.getValues());
    };

    useEffect(() => {
        const registerField = (
            field: DynamicFormContainerConfig,
            currentPath: string
        ) => {
            if (!field.name) return;

            const fieldPath = currentPath
                ? `${currentPath}.${field.name}`
                : field.name;

            const rules: any = {
                required: field.required ? "Este campo es requerido" : false,
                ...field.validation,
            };
            form.register(fieldPath, rules);

            const currentValue = form.getValues(fieldPath);
            if (currentValue === undefined && field.value !== undefined) {
                form.setValue(fieldPath, field.value, {
                    shouldValidate: true,
                    shouldDirty: false,
                });
            }
        };

        const registerAllFields = (
            container: DynamicFormContainerConfig,
            parentPath: string = ""
        ) => {
            let currentPath = parentPath;
            if (container.type === "form" && container.name) {
                currentPath = parentPath
                    ? `${parentPath}.${container.name}`
                    : container.name;
            }

            // Legacy support for 'fields' and 'containers'
            container.fields?.forEach((field) => {
                registerField(field, currentPath);
            });

            container.containers?.forEach((childContainer) => {
                registerAllFields(childContainer, currentPath);
            });

            // Recursive support for 'children'
            container.children?.forEach((child) => {
                const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(child.type);
                if (isContainer) {
                    registerAllFields(child, currentPath);
                } else {
                    registerField(child, currentPath);
                }
            });
        };

        // Start registration from the root config
        registerAllFields(config);
    }, [config, form]);

    useEffect(() => {
        if (data && form) {
            form.reset(data, {
                keepValues: true,
            });
        }
    }, [data, form]);

    useEffect(() => {
        const subscription = form.watch((value) => {
            if (onChange) {
                onChange(value);
            }
        });

        return () => subscription.unsubscribe();
    }, [form, onChange]);

    useEffect(() => {
        if (form) {
            setFormInvalid?.(!form.formState.isValid);
        }
    }, [form.formState.isValid]);

    useImperativeHandle(ref, () => {
        return {
            handleSubmit: async () => {
                const isValid = await form.trigger();

                if (isValid) emitSubmitData();
            },
        };
    });

    return {
        form,
        emitSubmitData,
    };
}
