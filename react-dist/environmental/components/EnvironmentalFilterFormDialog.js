import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { EnvironmentalFilterForm } from "./EnvironmentalFilterForm.js";
import { useId } from "react";
export const EnvironmentalFilterFormDialog = ({
  visible,
  onHide,
  onSubmit,
  type,
  title = "Nuevo Registro",
  loading = false,
  initialValues
}) => {
  const formId = useId();
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
    visible: visible,
    onHide: onHide,
    header: title,
    style: {
      width: '75vw'
    },
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      type: "button",
      label: "Cancelar",
      onClick: onHide,
      severity: "secondary",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-times me-1"
      })
    }), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      form: formId,
      label: "Guardar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-save me-1"
      }),
      disabled: loading
    })))
  }, /*#__PURE__*/React.createElement(EnvironmentalFilterForm, {
    formId: formId,
    onSubmit: onSubmit,
    type: type,
    initialValues: initialValues
  })));
};