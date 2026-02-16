import React from 'react';
import { Dialog } from 'primereact/dialog';
import { CompanyForm } from "./CompanyForm.js";
export const CompaniesFormDialog = props => {
  const {
    visible,
    onHide,
    initialData,
    onSaveSuccess
  } = props;
  return /*#__PURE__*/React.createElement(Dialog, {
    header: initialData ? "Editar Empresa" : "Nueva Empresa",
    visible: visible,
    onHide: onHide,
    style: {
      width: '80vw',
      maxWidth: '1000px'
    },
    modal: true,
    maximizable: true
  }, /*#__PURE__*/React.createElement(CompanyForm, {
    initialData: initialData,
    onSaveSuccess: onSaveSuccess
  }));
};