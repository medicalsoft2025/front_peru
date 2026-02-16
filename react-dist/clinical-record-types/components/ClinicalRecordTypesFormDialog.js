import React from 'react';
import { Dialog } from 'primereact/dialog';
import { ClinicalRecordTypesForm } from "./ClinicalRecordTypesForm.js";
import { Button } from 'primereact/button';
export const ClinicalRecordTypesFormDialog = props => {
  const formId = "clinical-record-types-form";
  const {
    visible,
    initialData,
    onHide,
    onSubmit,
    loading
  } = props;
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Formulario",
    visible: visible,
    onHide: onHide,
    style: {
      width: '75vw'
    },
    draggable: false,
    resizable: false,
    maximizable: true,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-times me-1"
      }),
      severity: "secondary",
      onClick: onHide
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Guardar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-save me-1"
      }),
      form: formId,
      type: "submit",
      disabled: loading
    }))
  }, /*#__PURE__*/React.createElement(ClinicalRecordTypesForm, {
    formId: formId,
    onSubmit: onSubmit,
    initialData: initialData
  }));
};