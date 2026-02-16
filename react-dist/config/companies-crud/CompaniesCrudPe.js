import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useCompaniesCrud } from "./hooks/useCompaniesCrud.js";
import { CompaniesList } from "./CompaniesList.js";
import { CompanyForm } from "./CompanyForm.js";
export const CompaniesCrud = () => {
  const {
    companies,
    isLoading,
    selectedCompany,
    setSelectedCompany,
    fetchCompanies,
    deleteCompany,
    toast
  } = useCompaniesCrud();
  const [showDialog, setShowDialog] = useState(false);
  const handleCreate = () => {
    setSelectedCompany(null);
    setShowDialog(true);
  };
  const handleEdit = company => {
    setSelectedCompany(company);
    setShowDialog(true);
  };
  const handleDelete = company => {
    deleteCompany(company);
  };
  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedCompany(null);
  };
  const handleSaveSuccess = () => {
    // Refresh list
    fetchCompanies();
    // If we want to keep dialog open to edit other tabs, we strictly might need to know 
    // if it was a create action that returned new ID.
    // For simplicity, if it was an update, we might keep it open or just close.
    // If it was Create, we should probably close so user can see it in list, or switch to edit mode.
    // Given existing GeneralInfoForm logic, it calls onSuccess after save.

    // If it was a Create action, we force a refresh. 
    // Ideally we would switch to "Edit" mode with the new ID so they can add branches immediately.
    // But adapting that flow requires changing GeneralInfoForm to return the new ID.
    // As implemented, it just calls void onSuccess.
    // We will just close the dialog for now if it was a create (implied by no selectedCompany initially).
    // Actually simplest is just always reload list.
    if (!selectedCompany) {
      handleCloseDialog();
    } else {
      // If editing, maybe they just saved one tab. We shouldn't close the whole dialog arbitrarily?
      // But GeneralInfoForm calls onSuccess. RepresentativeTab doesn't interact with this prop directly in CompanyForm yet.
      // Wait, CompanyForm passes onSaveSuccess to GeneralInfoForm ONLY.
      // RepresentativeTab and others handle their own saving internally with toasts.
      // So onSaveSuccess is only triggered by General Info.
      // If we are editing, we probably want to stay on the page.
    }
  };

  // We strictly need to handle the "Created" case to allow adding branches immediately.
  // But let's stick to base requirements: CRUD.

  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid fade-in"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm p-3 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "mb-0 fw-bold text-primary"
  }, "Gesti\xF3n de Empresas"), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Empresa",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-plus me-1"
    }),
    className: "p-button-primary",
    onClick: handleCreate
  })), /*#__PURE__*/React.createElement(CompaniesList, {
    data: companies,
    loading: isLoading,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onReload: fetchCompanies
  })), /*#__PURE__*/React.createElement(Dialog, {
    header: selectedCompany ? `Editar Empresa: ${selectedCompany.legal_name}` : "Nueva Empresa",
    visible: showDialog,
    style: {
      width: '90vw',
      maxWidth: '1200px'
    },
    onHide: handleCloseDialog,
    maximizable: true,
    modal: true,
    contentClassName: "p-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3"
  }, /*#__PURE__*/React.createElement(CompanyForm, {
    company: selectedCompany,
    onClose: handleCloseDialog,
    onSaveSuccess: handleSaveSuccess
  }))));
};