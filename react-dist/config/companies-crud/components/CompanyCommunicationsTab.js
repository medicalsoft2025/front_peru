import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { CompanyWhatsAppConnection } from "./CompanyWhatsAppConnection.js";
export const CompanyCommunicationsTab = ({
  companyId
}) => {
  const [whatsAppStatus, setWhatsAppStatus] = useState({
    connected: false
  });
  return /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold mb-4"
  }, "Configuraci\xF3n de Comunicaciones"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-4"
  }, "Configura la conexi\xF3n de WhatsApp para enviar notificaciones a tus pacientes desde esta empresa."), /*#__PURE__*/React.createElement(CompanyWhatsAppConnection, {
    companyId: companyId,
    onStatusChange: setWhatsAppStatus
  })))));
};