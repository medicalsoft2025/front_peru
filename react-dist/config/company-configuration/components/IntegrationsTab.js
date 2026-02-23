import React from "react";
import { IntegrationsApp } from "../../../integrations/IntegrationsApp.js";
export const IntegrationsTab = ({
  companyId,
  onValidationChange
}) => {
  console.log("Company ID:", companyId);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement(IntegrationsApp, {
    companyId: companyId
  })));
};
export default IntegrationsTab;