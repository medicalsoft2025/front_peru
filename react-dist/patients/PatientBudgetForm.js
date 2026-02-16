import React from "react";
import { FormPurchaseOrders } from "../invoices/form/FormPurchaseOrdersV2.js";
import { usePatientThirdParty } from "./hooks/usePatientThirdParty.js";
export const PatientBudgetForm = ({
  patientId
}) => {
  const {
    patientThirdParty,
    isLoading
  } = usePatientThirdParty(patientId);
  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", null, "Cargando...");
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FormPurchaseOrders, {
    dataToEdit: {
      third_party_id: patientThirdParty?.id,
      type: "quote_of"
    },
    fieldsConfig: {
      supplier: {
        disabled: true
      },
      type: {
        disabled: true
      }
    },
    title: `Crear Cotización | ${patientThirdParty?.name}`
  }));
};