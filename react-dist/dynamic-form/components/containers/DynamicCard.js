import React from "react";
import { Card } from "primereact/card";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
import { useDynamicFormContainer } from "../../hooks/useDynamicFormContainer.js";
import { DynamicField } from "../fields/DynamicField.js";
export const DynamicCard = ({
  config,
  form,
  actualFormGroup
}) => {
  const {
    hasFields,
    hasContainers,
    shouldRenderFields
  } = useDynamicFormContainer({
    config,
    form: form,
    parentPath: actualFormGroup
  });
  const header = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-0 p-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-xl"
  }, config.label));
  if (!hasFields && !hasContainers) return null;
  return /*#__PURE__*/React.createElement(Card, {
    title: config.label ? header : null,
    className: `shadow-1 ${config.styleClass}`
  }, /*#__PURE__*/React.createElement("div", {
    className: config.contentStyleClass
  }, (config.children || config.containers || config.fields)?.map((child, index) => {
    const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(child.type);
    if (isContainer) {
      return /*#__PURE__*/React.createElement(DynamicFormContainer, {
        key: child.name || `container-${index}`,
        config: child,
        form: form,
        parentPath: actualFormGroup,
        className: child.styleClass
      });
    } else {
      return /*#__PURE__*/React.createElement(DynamicField, {
        key: child.name,
        field: child,
        form: form,
        parentPath: actualFormGroup,
        className: child.styleClass
      });
    }
  })));
};