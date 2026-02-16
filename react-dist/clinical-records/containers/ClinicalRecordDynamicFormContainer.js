import React, { useRef, useState } from "react";
import { ClinicalRecordDynamicForm } from "../components/ClinicalRecordDynamicForm.js";
import { AddParaclinicalButton } from "../AddParaclinicalButton.js";
import { SeePatientInfoButton } from "../../patients/SeePatientInfoButton.js";
import { Breadcrumb } from "../../layout/breadcrumb/Breadcrumb.js";
import { usePatient } from "../../patients/hooks/usePatient.js";
import { TimerApp } from "../../components/timer/TimerApp.js";
import { Button } from "primereact/button";
import { FinishClinicalRecordModal } from "../FinishClinicalRecordModal.js";
export const ClinicalRecordDynamicFormContainer = () => {
  const patientId = new URLSearchParams(window.location.search).get('patient_id');
  const speciality = new URLSearchParams(window.location.search).get('especialidad');
  const dynamicFormId = new URLSearchParams(window.location.search).get('dynamic_form_id');
  const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');
  const [formValues, setFormValues] = useState({
    tabsStructure: [],
    values: {},
    rips: []
  });
  const [isInvalid, setIsInvalid] = useState(false);
  const {
    patient
  } = usePatient(patientId);
  const patientName = patient?.full_name || "Cargando...";
  const backUrl = `consultas-especialidad?patient_id=${patientId}&especialidad=${speciality}&appointment_id=${appointmentId}`;
  const breadcrumbItems = [{
    label: "Inicio",
    href: "Dashboard"
  }, {
    label: "Pacientes",
    href: "pacientes"
  }, {
    label: patientName,
    href: `verPaciente?id=${patientId}`
  }, {
    label: "Consultas",
    href: backUrl
  }];
  const dynamicFormRef = useRef(null);
  const finishConsultationModalRef = useRef(null);
  const handleCancelConsultation = () => {
    window.location.href = backUrl;
  };
  const handleFinishConsultation = () => {
    dynamicFormRef.current?.handleSubmit();
    finishConsultationModalRef.current?.showModal();
  };
  const handleFormSubmit = values => {
    setFormValues(prev => ({
      ...prev,
      values: values
    }));
  };
  const handleIsInvalidChange = invalid => {
    setIsInvalid(invalid);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Breadcrumb, {
    items: breadcrumbItems,
    activeItem: "Consulta Primera vez"
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-between gap-2 mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0"
  }, "Nueva Consulta"), /*#__PURE__*/React.createElement("small", null, patientName))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-inline-flex"
  }, /*#__PURE__*/React.createElement(AddParaclinicalButton, null)), /*#__PURE__*/React.createElement(SeePatientInfoButton, {
    patientId: patientId
  }))), /*#__PURE__*/React.createElement(ClinicalRecordDynamicForm, {
    ref: dynamicFormRef,
    dynamicFormId: dynamicFormId,
    onSubmit: handleFormSubmit,
    onIsInvalidChange: handleIsInvalidChange
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-between"
  }, /*#__PURE__*/React.createElement("div", null, "Tiempo en consulta: ", /*#__PURE__*/React.createElement(TimerApp, null)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    severity: "danger",
    type: "button",
    onClick: handleCancelConsultation,
    label: "Cancelar consulta"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    onClick: handleFinishConsultation,
    disabled: isInvalid,
    label: "Terminar consulta"
  })))), /*#__PURE__*/React.createElement(FinishClinicalRecordModal, {
    ref: finishConsultationModalRef,
    initialExternalDynamicData: formValues
  }));
};