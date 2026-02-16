import React, { useState, useRef } from "react";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import PatientStep from "./steps/PatientStep.js";
import ProductsStep from "./steps/ProductsStep.js";
import PaymentStep from "./steps/PaymentStep.js";
import PreviewStep from "./steps/PreviewStep.js";
import DoneStep from "./steps/DoneStep.js";
const admissionBilling = ({
  visible,
  onHide
}) => {
  const stepperRef = useRef(null);
  const toast = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Estado compartido
  const [formData, setFormData] = useState({
    patient: {
      documentType: "",
      documentNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      secondLastName: "",
      birthDate: null,
      gender: "",
      country: "",
      department: "",
      city: "",
      address: "",
      email: "",
      whatsapp: "",
      bloodType: "",
      hasCompanion: false,
      facturacionEntidad: false,
      facturacionConsumidor: false
    },
    billing: {
      entity: "",
      authorizationDate: null,
      authorizationNumber: "",
      authorizedAmount: ""
    },
    products: [{
      id: 1,
      description: "Consulta Endocrinologia",
      price: 2000,
      quantity: 1,
      tax: 0,
      total: 2000
    }],
    payments: [],
    currentPayment: {
      method: "",
      amount: "",
      authorizationNumber: "",
      notes: ""
    }
  });
  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...data
      }
    }));
  };
  const nextStep = async () => {
    if (stepperRef.current) {
      stepperRef.current.nextCallback();
      setActiveIndex(prev => prev + 1);
    }
  };
  const prevStep = () => {
    if (stepperRef.current) {
      stepperRef.current.prevCallback();
      setActiveIndex(prev => prev - 1);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: onHide,
    header: "Nueva Factura",
    style: {
      width: '90vw',
      maxWidth: '1200px'
    },
    maximizable: true
  }, /*#__PURE__*/React.createElement(Stepper, {
    ref: stepperRef
  }, /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Datos del paciente"
  }, /*#__PURE__*/React.createElement(PatientStep, {
    formData: formData,
    updateFormData: updateFormData,
    nextStep: nextStep,
    toast: toast
  })), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Seleccionar producto"
  }, /*#__PURE__*/React.createElement(ProductsStep, {
    formData: formData,
    updateFormData: updateFormData,
    nextStep: nextStep,
    prevStep: prevStep,
    toast: toast
  })), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "M\xE9todos de pago"
  }, /*#__PURE__*/React.createElement(PaymentStep, {
    formData: formData,
    updateFormData: updateFormData,
    nextStep: nextStep,
    prevStep: prevStep,
    toast: toast
  })), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Previsualizaci\xF3n"
  }, /*#__PURE__*/React.createElement(PreviewStep, {
    formData: formData,
    nextStep: nextStep,
    prevStep: prevStep
  })), /*#__PURE__*/React.createElement(StepperPanel, {
    header: "Hecho"
  }, /*#__PURE__*/React.createElement(DoneStep, {
    onHide: onHide
  })))));
};
export default admissionBilling;