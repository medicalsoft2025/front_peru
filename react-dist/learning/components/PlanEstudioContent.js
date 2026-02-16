import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { PlanEstudioForm } from "./PlanEstudioForm.js";
import { PlanEstudioTable } from "./PlanEstudioTable.js";
import { useLocalStorageContext } from "../context/LocalStorageContext.js";
import { Toast } from 'primereact/toast';
export const PlanEstudioContent = () => {
  const {
    dialogVisible,
    openDialogCreate,
    closeDialog,
    toast
  } = useLocalStorageContext();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center mb-3"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Item",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-1"
    }),
    onClick: openDialogCreate
  })), /*#__PURE__*/React.createElement(PlanEstudioTable, null), /*#__PURE__*/React.createElement(Dialog, {
    visible: dialogVisible,
    onHide: closeDialog,
    header: "Agregar Item",
    style: {
      width: '50vw'
    }
  }, /*#__PURE__*/React.createElement(PlanEstudioForm, null)));
};