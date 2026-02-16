import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { EnvironmentalWasteForm } from "./forms/EnvironmentalWasteForm.js";
import { EnvironmentalTemperatureForm } from "./forms/EnvironmentalTemperatureForm.js";
import { EnvironmentalHumidityForm } from "./forms/EnvironmentalHumidityForm.js";
import { EnvironmentalCleaningForm } from "./forms/EnvironmentalCleaningForm.js";
import { useEnvironmentalWasteRecordCreate } from "../hooks/waste-records/useEnvironmentalWasteRecordCreate.js";
import { useEnvironmentalTemperatureRecordCreate } from "../hooks/temperature-records/useEnvironmentalTemperatureRecordCreate.js";
import { useEnvironmentalHumidityRecordCreate } from "../hooks/humidity-records/useEnvironmentalHumidityRecordCreate.js";
import { useEnvironmentalCleaningRecordCreate } from "../hooks/cleaning-records/useEnvironmentalCleaningRecordCreate.js";
export const EnvironmentalRecordFormDialog = ({
  visible,
  onHide
}) => {
  const [date, setDate] = useState(new Date());
  const [activeIndex, setActiveIndex] = useState(0);

  // Create hooks
  const {
    createEnvironmentalWasteRecord,
    loading: wasteLoading,
    toast: wasteToast
  } = useEnvironmentalWasteRecordCreate();
  const {
    createEnvironmentalTemperatureRecord,
    loading: tempLoading,
    toast: tempToast
  } = useEnvironmentalTemperatureRecordCreate();
  const {
    createEnvironmentalHumidityRecord,
    loading: humidityLoading,
    toast: humidityToast
  } = useEnvironmentalHumidityRecordCreate();
  const {
    createEnvironmentalCleaningRecord,
    loading: cleaningLoading,
    toast: cleaningToast
  } = useEnvironmentalCleaningRecordCreate();
  const getActiveFormId = () => {
    switch (activeIndex) {
      case 0:
        return 'waste-form';
      case 1:
        return 'temperature-form';
      case 2:
        return 'humidity-form';
      case 3:
        return 'cleaning-form';
      default:
        return '';
    }
  };
  const handleSuccess = () => {
    setTimeout(() => {
      onHide();
    }, 1000);
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Nuevo Registro Ambiental",
    visible: visible,
    onHide: onHide,
    style: {
      width: '80vw',
      height: '80vh'
    },
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      severity: "secondary",
      onClick: onHide,
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-times me-1"
      })
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Guardar",
      type: "submit",
      form: getActiveFormId(),
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-save me-1"
      })
    }))
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: wasteToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: tempToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: humidityToast
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: cleaningToast
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "date",
    className: "fw-bold"
  }, "Fecha"), /*#__PURE__*/React.createElement(Calendar, {
    id: "date",
    value: date,
    onChange: e => setDate(e.value),
    dateFormat: "dd/mm/yy",
    showIcon: true,
    className: "w-100"
  })), /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "Residuos"
  }, /*#__PURE__*/React.createElement(EnvironmentalWasteForm, {
    formId: "waste-form",
    date: date,
    onSave: async data => {
      await createEnvironmentalWasteRecord(data);
      handleSuccess();
    }
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Temperatura"
  }, /*#__PURE__*/React.createElement(EnvironmentalTemperatureForm, {
    formId: "temperature-form",
    date: date,
    onSave: async data => {
      await createEnvironmentalTemperatureRecord(data);
      handleSuccess();
    }
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Humedad"
  }, /*#__PURE__*/React.createElement(EnvironmentalHumidityForm, {
    formId: "humidity-form",
    date: date,
    onSave: async data => {
      await createEnvironmentalHumidityRecord(data);
      handleSuccess();
    }
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Limpieza y desinfecci\xF3n"
  }, /*#__PURE__*/React.createElement(EnvironmentalCleaningForm, {
    formId: "cleaning-form",
    date: date,
    onSave: async data => {
      await createEnvironmentalCleaningRecord(data);
      handleSuccess();
    }
  })))));
};