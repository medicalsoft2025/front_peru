import React from "react";
import { Breadcrumb } from "./Breadcrumb.js";
import { usePatient } from "../../patients/hooks/usePatient.js";
export const PatientBreadcrumb = props => {
  const {
    items,
    activeItem,
    patientItemIndex,
    patientId
  } = props;
  const {
    patient
  } = usePatient(patientId);
  const patientItem = {
    label: patient?.full_name || "Cargando...",
    href: `verPaciente?${patientId}`
  };
  const finalItems = items.map((item, index) => {
    if (index === patientItemIndex) {
      return patientItem;
    }
    return item;
  });
  return /*#__PURE__*/React.createElement(Breadcrumb, {
    items: finalItems,
    activeItem: activeItem
  });
};