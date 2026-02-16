import React from "react";
import { useDynamicForm } from "../../app-forms/hooks/useDynamicForm.js";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
export const ClinicalRecordDynamicForm = props => {
  const {
    dynamicFormId,
    onSubmit,
    onIsInvalidChange
  } = props;
  const {
    dynamicForm
  } = useDynamicForm(dynamicFormId);
  if (!dynamicForm) {
    return /*#__PURE__*/React.createElement("div", null, "Cargando...");
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(DynamicForm, {
    ref: props.ref,
    config: dynamicForm.config,
    onSubmit: onSubmit,
    showVoiceAssistant: true,
    onIsInvalidChange: onIsInvalidChange
  }));
};