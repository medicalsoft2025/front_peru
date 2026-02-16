import React from "react";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
import { useFieldConditions } from "../../hooks/useFieldConditions.js";
import { useFormContext } from "../../context/FormContext.js";
import { FormProvider } from "../../providers/FormProvider.js";
export const DynamicTableArrayCell = ({
  colNode,
  form,
  basePath,
  index
}) => {
  const {
    fieldStates
  } = useFieldConditions({
    config: colNode,
    // We only check rules inside this cell's config
    form,
    basePath
  });
  const parentContext = useFormContext();
  const mergedFieldStates = {
    ...parentContext.fieldStates,
    ...fieldStates
  };
  return /*#__PURE__*/React.createElement(FormProvider, {
    value: {
      fieldStates: mergedFieldStates,
      form: form,
      setFieldState: parentContext.setFieldState
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: `dynamic-container-cell ${colNode.styleClass || ""}`
  }, /*#__PURE__*/React.createElement(DynamicFormContainer, {
    config: colNode,
    form: form,
    parentPath: basePath,
    className: "w-full"
  })));
};