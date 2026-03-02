import React from "react";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { PatientDocumentsForm } from "./PatientDocumentsForm.js";
import { PatientDocumentsTable } from "./PatientDocumentsTable.js";
import { Dialog } from "primereact/dialog";
import { patientDocumentsService } from "../../../services/api/index.js";
export const PatientDocumentsApp = () => {
  const toast = React.useRef(null);
  const [showForm, setShowForm] = React.useState(false);
  const [refreshTable, setRefreshTable] = React.useState(false);
  const [dataToEdit, setDataToEdit] = React.useState(null);
  const handleFormToggle = () => {
    setShowForm(prev => !prev);
    setRefreshTable(false);
  };
  const handleOnEdit = data => {
    setDataToEdit(data);
    setShowForm(prev => !prev);
  };
  const handleOnSave = async data => {
    try {
      if (data.id) {
        const response = await patientDocumentsService.update(data.id, data);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Documento del paciente actualizado correctamente",
          life: 3000
        });
      } else {
        const response = await patientDocumentsService.create(data);
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Documento del paciente creado correctamente",
          life: 3000
        });
      }
      setShowForm(prev => !prev);
      setRefreshTable(true);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000
      });
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h4", null, "Documentos"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo",
    tooltipOptions: {
      position: "top"
    },
    onClick: () => handleFormToggle(),
    className: "p-button-info "
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-plus ms-2"
  }, " ")))), /*#__PURE__*/React.createElement(PatientDocumentsTable, {
    refreshData: refreshTable,
    onHandleEdit: handleOnEdit
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: showForm,
    onHide: handleFormToggle,
    header: "Nuevo Documento",
    style: {
      width: "70vw"
    }
  }, /*#__PURE__*/React.createElement(PatientDocumentsForm, {
    onSave: handleOnSave,
    dataToEdit: dataToEdit
  })), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};