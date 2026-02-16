import React from "react";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
import { Button } from "primereact/button";
import { useFieldConditions } from "../../hooks/useFieldConditions.js";
import { useFormContext } from "../../context/FormContext.js";
import { FormProvider } from "../../providers/FormProvider.js";
import { useDynamicFormContainer } from "../../hooks/useDynamicFormContainer.js";
import { DynamicField } from "../fields/DynamicField.js";
export const DynamicArrayItem = ({
  config,
  form,
  index,
  basePath,
  onRemove,
  removeLabel = "Eliminar"
}) => {
  const {
    fieldStates
  } = useFieldConditions({
    config,
    form,
    basePath: basePath
  });
  const {
    hasFields,
    hasContainers,
    shouldRenderFields
  } = useDynamicFormContainer({
    config,
    form,
    parentPath: basePath
  });
  const parentContext = useFormContext();
  const mergedFieldStates = {
    ...parentContext.fieldStates,
    ...fieldStates
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3 mb-4 p-3 border rounded"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold fs-7"
  }, "#", index + 1), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-trash"
    }),
    className: "p-button-danger",
    onClick: () => onRemove(index),
    tooltip: removeLabel
  })), /*#__PURE__*/React.createElement(FormProvider, {
    value: {
      fieldStates: mergedFieldStates,
      form: form,
      setFieldState: parentContext.setFieldState,
      onElementSelect: parentContext.onElementSelect
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: config.contentStyleClass
  }, (config.children || config.containers || config.fields)?.map((child, index) => {
    const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(child.type);
    if (isContainer) {
      return /*#__PURE__*/React.createElement(DynamicFormContainer, {
        key: child.name || `container-${index}`,
        config: child,
        form: form,
        parentPath: basePath,
        className: child.styleClass
      });
    } else {
      return /*#__PURE__*/React.createElement(DynamicField, {
        key: child.name,
        field: child,
        form: form,
        parentPath: basePath,
        className: child.styleClass
      });
    }
  }))));
};