import { useEffect, useImperativeHandle } from "react";
import { useForm } from "react-hook-form";
export function useDynamicForm({
  config,
  onSubmit,
  ref,
  data,
  onChange,
  setFormInvalid
}) {
  const form = useForm({
    mode: "onChange",
    defaultValues: data || {},
    shouldUnregister: false,
    reValidateMode: "onChange"
  });
  const emitSubmitData = () => {
    onSubmit(form.getValues());
  };
  useEffect(() => {
    const registerField = (field, currentPath) => {
      if (!field.name) return;
      const fieldPath = currentPath ? `${currentPath}.${field.name}` : field.name;
      const rules = {
        required: field.required ? "Este campo es requerido" : false,
        ...field.validation
      };
      form.register(fieldPath, rules);
      const currentValue = form.getValues(fieldPath);
      if (currentValue === undefined && field.value !== undefined) {
        form.setValue(fieldPath, field.value, {
          shouldValidate: true,
          shouldDirty: false
        });
      }
    };
    const registerAllFields = (container, parentPath = "") => {
      let currentPath = parentPath;
      if (container.type === "form" && container.name) {
        currentPath = parentPath ? `${parentPath}.${container.name}` : container.name;
      }

      // Legacy support for 'fields' and 'containers'
      container.fields?.forEach(field => {
        registerField(field, currentPath);
      });
      container.containers?.forEach(childContainer => {
        registerAllFields(childContainer, currentPath);
      });

      // Recursive support for 'children'
      container.children?.forEach(child => {
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
        keepValues: true
      });
    }
  }, [data, form]);
  useEffect(() => {
    const subscription = form.watch(value => {
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
      }
    };
  });
  return {
    form,
    emitSubmitData
  };
}