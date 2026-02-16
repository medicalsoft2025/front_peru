import React from 'react';
import { usePatientsActiveCount } from "./hooks/usePatientsActiveCount.js";
export const PatientsSummaryCard = () => {
  const {
    count,
    isFetching,
    isLoading
  } = usePatientsActiveCount();
  const handleViewPatients = () => {
    window.location.href = 'pacientescontrol';
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card bg-secondary dashboard-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "card-title"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-restroom ml-2"
  }), " Pacientes"), /*#__PURE__*/React.createElement("div", {
    className: "card-content"
  }, isFetching || isLoading ? /*#__PURE__*/React.createElement("span", {
    className: "text-span-descripcion"
  }, "Cargando...") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h3", {
    id: "patientsActiveCount"
  }, count), /*#__PURE__*/React.createElement("span", {
    className: "text-span-descripcion"
  }, "Pacientes Creados"))), /*#__PURE__*/React.createElement("div", {
    className: "card-button"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-phoenix-secondary me-1 mb-1",
    type: "button",
    onClick: handleViewPatients
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-eye"
  }), " Ver Pacientes"))));
};