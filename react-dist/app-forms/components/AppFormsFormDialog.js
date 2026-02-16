import React from 'react';
import { Dialog } from 'primereact/dialog';
import { FormBuilder } from "../../form-builder/components/FormBuilder.js";
export const AppFormsFormDialog = props => {
  const {
    visible,
    initialData,
    onHide,
    onSubmit,
    loading = false
  } = props;
  console.log("initialData", initialData);
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Formulario",
    visible: visible,
    onHide: onHide,
    style: {
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      maxWidth: '100vw'
    },
    draggable: false,
    resizable: false,
    maximizable: true,
    pt: {
      root: {
        style: {
          width: '100vw',
          height: '100vh',
          maxHeight: '100vh',
          maxWidth: '100vw'
        }
      }
    }
  }, /*#__PURE__*/React.createElement(FormBuilder, {
    onSubmit: onSubmit,
    initialData: initialData,
    loading: loading
  }));
};