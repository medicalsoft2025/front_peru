import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm.js";
export const IntegrationConfig = props => {
  const {
    configs = [],
    configFields,
    onSubmit
  } = props;
  const handleSubmit = data => {
    onSubmit?.(data);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicIntegrationForm, {
    configs: configs,
    initialConfigFields: configFields,
    onSubmit: handleSubmit
  }));
};