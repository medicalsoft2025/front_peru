import { Button } from 'primereact/button';
import React from 'react';
const ContactSection = ({
  patient
}) => {
  if (!patient) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "contact-section"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "section-title"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-atlas me-2"
  }), "Informaci\xF3n de Contacto", /*#__PURE__*/React.createElement("div", {
    className: "d-flex"
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    style: {
      width: "100%",
      marginLeft: "10px",
      fontSize: "10px",
      marginTop: "10px"
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-edit"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "contact-details-grid"
  }, /*#__PURE__*/React.createElement(ContactDetailItem, {
    icon: "fas fa-map-marker-alt",
    label: "Direcci\xF3n:",
    value: patient.address || "No disponible"
  }), /*#__PURE__*/React.createElement(ContactDetailItem, {
    icon: "fas fa-phone",
    label: "Tel\xE9fono:",
    value: patient.full_phone || patient.whatsapp || "No disponible"
  }), /*#__PURE__*/React.createElement(ContactDetailItem, {
    icon: "fas fa-envelope",
    label: "Correo:",
    value: patient.email || "No disponible"
  }), /*#__PURE__*/React.createElement(ContactDetailItem, {
    icon: "fas fa-globe-americas",
    label: "Ciudad:",
    value: patient.city_id || "No especificada"
  })));
};
const ContactDetailItem = ({
  icon,
  label,
  value
}) => /*#__PURE__*/React.createElement("div", {
  className: "contact-detail-item"
}, /*#__PURE__*/React.createElement("div", {
  className: "contact-detail-label"
}, /*#__PURE__*/React.createElement("i", {
  className: `${icon} me-2`
}), label), /*#__PURE__*/React.createElement("div", {
  className: "contact-detail-value"
}, value));
const InsuranceBadge = ({
  entityName
}) => /*#__PURE__*/React.createElement("div", {
  className: "insurance-section"
}, /*#__PURE__*/React.createElement("div", {
  className: "insurance-badge"
}, /*#__PURE__*/React.createElement("i", {
  className: "pi pi-id-card me-2"
}), entityName || "Particular"));
export default ContactSection;