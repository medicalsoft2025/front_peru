import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useLocalStorageContext } from "../context/LocalStorageContext.js";
import { PlanEstudioFormContainer } from "./PlanEstudioFormContainer.js";
import { PlanEstudioTableContainer } from "./PlanEstudioTableContainer.js";
import { usePRToast } from "../../hooks/usePRToast.js";
import { Toast } from 'primereact/toast';
export const PlanEstudio = () => {
  const {
    setSelectedItem
  } = useLocalStorageContext();
  const [dialogVisible, setDialogVisible] = useState(false);
  const {
    toast
  } = usePRToast(); // Using the toast hook here if needed for global notifications or pass ref

  const openDialogCreate = () => {
    setSelectedItem(null);
    setDialogVisible(true);
  };
  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedItem(null);
  };
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
  })), /*#__PURE__*/React.createElement(PlanEstudioTableContainer, {
    onEdit: item => {
      setSelectedItem(item);
      setDialogVisible(true);
    }
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: dialogVisible,
    onHide: closeDialog,
    header: "Gesti\xF3n de Plan de Estudio",
    style: {
      width: '50vw'
    }
  }, /*#__PURE__*/React.createElement(PlanEstudioFormContainer, {
    onCancel: closeDialog,
    onSuccess: closeDialog
  })));
};