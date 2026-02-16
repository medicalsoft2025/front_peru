import { Button } from "primereact/button";
import React from "react";
import { appointmentToInitClaimProcessPayload } from "../mappers/appointmentToInitClaimProcessPayload.js";
import { useProductsToBeInvoiced } from "../../../appointments/hooks/useProductsToBeInvoiced.js";
import { useAppointment } from "../../../appointments/hooks/useAppointment.js";
import { useInitClaimProcess } from "../hooks/useInitClaimProcess.js";
export const KoneksiIntegration = ({
  appointmentId
}) => {
  const {
    appointment
  } = useAppointment(appointmentId);
  const {
    products
  } = useProductsToBeInvoiced(appointmentId);
  const {
    initClaimProcess,
    loading,
    error,
    data
  } = useInitClaimProcess();
  const handleAuthorization = () => {
    const payload = appointmentToInitClaimProcessPayload(appointment, products);
    initClaimProcess(payload);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Autorizar con ARS",
    onClick: handleAuthorization
  }), loading && /*#__PURE__*/React.createElement("p", null, "Cargando..."), data && /*#__PURE__*/React.createElement("p", null, "Respuesta: ", JSON.stringify(data)));
};