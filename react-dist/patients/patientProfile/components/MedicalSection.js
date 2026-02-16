// components/PatientProfileCard/MedicalSection.jsx
import React from 'react';
import { Button } from 'primereact/button';
import { formatDate, getLastAppointment } from "../utils/utilsPatient.js";
const MedicalSection = ({
  patient,
  onShowMedicalDetails
}) => {
  if (!patient) return null;
  const lastAppointment = getLastAppointment(patient.appointments);
  return /*#__PURE__*/React.createElement("div", {
    className: "medical-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-header"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "section-title"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-heartbeat me-2"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: "100%"
    }
  }, "Antecedentes M\xE9dicos"), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    style: {
      width: "auto",
      fontSize: "10px",
      marginTop: "10px"
    },
    onClick: onShowMedicalDetails
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-eye"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "medical-info-grid"
  }, /*#__PURE__*/React.createElement(MedicalItem, {
    icon: "fas fa-calendar-alt",
    label: "\xDAltima consulta:",
    value: lastAppointment ? formatDate(lastAppointment.appointment_date) : "No disponible"
  }), /*#__PURE__*/React.createElement(MedicalItem, {
    icon: "fas fa-shield-alt",
    label: "Alergias:",
    value: patient.has_allergies ? patient.allergies : "Ninguna registrada"
  }), /*#__PURE__*/React.createElement(MedicalItem, {
    icon: "fas fa-briefcase-medical",
    label: "Enfermedades:",
    value: patient.has_special_condition ? patient.special_condition : "Ninguna registrada"
  })));
};
const MedicalItem = ({
  icon,
  label,
  value
}) => /*#__PURE__*/React.createElement("div", {
  className: "medical-item"
}, /*#__PURE__*/React.createElement("div", {
  className: "medical-label"
}, /*#__PURE__*/React.createElement("i", {
  className: `${icon} me-2`
}), label), /*#__PURE__*/React.createElement("div", {
  className: "medical-value"
}, value));
export default MedicalSection;