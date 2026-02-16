import { useMemo, useEffect } from "react";
export function useDynamicFormContainer({
  config,
  form,
  parentPath = ""
}) {
  const containerType = config.type || "default";
  const getActualFormGroupPath = () => {
    if (config.type === "form" && config.name) {
      return parentPath ? `${parentPath}.${config.name}` : config.name;
    }
    return parentPath;
  };
  const actualFormGroupPath = getActualFormGroupPath();
  const hasFields = useMemo(() => config.children !== undefined ? config.children.some(c => !["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(c.type)) : !!config.fields && config.fields.length > 0, [config.fields, config.children]);
  const hasContainers = useMemo(() => config.children !== undefined ? config.children.some(c => ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(c.type)) : !!config.containers && config.containers.length > 0, [config.containers, config.children]);
  const hasChildren = useMemo(() => config.children !== undefined, [config.children]);
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
    shouldRenderDivider
  };
}