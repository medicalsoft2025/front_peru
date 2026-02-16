import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm.js";
export const LabplusIntegrationConfig = props => {
  const {
    configs = [],
    onSubmit
  } = props;
  const initialConfigFields = [{
    field: "LABPLUS_URL",
    label: "URL",
    type: "text"
  }, {
    field: "LABPLUS_TOKEN",
    label: "Token",
    type: "text"
  }];
  const handleSubmit = data => {
    onSubmit?.(data);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicIntegrationForm, {
    configs: configs,
    initialConfigFields: initialConfigFields,
    onSubmit: handleSubmit
  }));
};