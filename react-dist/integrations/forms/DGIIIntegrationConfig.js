import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm.js";
export const DGIIIntegrationConfig = props => {
  const {
    configs = [],
    onSubmit
  } = props;
  const initialConfigFields = [{
    field: "DGII_FILE",
    label: "Certificado P12",
    type: "file",
    description: "Certificado P12 del DGII"
  }, {
    field: "DGII_PASSWORD",
    label: "Contraseña",
    type: "password",
    description: "Contraseña del certificado P12"
  }, {
    field: "DGII_TENANTS",
    label: "Tenants",
    type: "list",
    source: "DGII_TENANTS",
    sourceType: "static",
    multiple: false,
    placeholder: "Seleccione un tenant"
  }, {
    field: "DGII_USERS",
    label: "Usuarios",
    type: "list",
    source: "USERS",
    sourceType: "api",
    multiple: true,
    placeholder: "Seleccione un usuario"
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