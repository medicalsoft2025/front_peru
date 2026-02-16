import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ClinicalRecordTypesFormDialog } from "./ClinicalRecordTypesFormDialog.js";
import { ClinicalRecordTypesTable } from "./ClinicalRecordTypesTable.js";
import { ClinicalRecordTypeDtoMapper } from "../mappers/clinicalRecordTypeDtoMapper.js";
import { useClinicalRecordTypesComponent } from "../hooks/useClinicalRecordTypesComponent.js";
export const ClinicalRecordTypes = () => {
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const {
    clinicalRecordTypes,
    isLoadingClinicalRecordTypes,
    isLoadingClinicalRecordType,
    isLoadingCreate,
    isLoadingUpdate,
    clinicalRecordType,
    setSelectedItem,
    save,
    remove,
    fetchClinicalRecordTypes,
    toastCreate,
    toastUpdate,
    toastDelete
  } = useClinicalRecordTypesComponent();
  const onSubmit = async data => {
    await save(data);
    setShowFormDialog(false);
  };
  const onCreate = () => {
    setSelectedItem(null);
    setInitialData(null);
    setShowFormDialog(true);
  };
  const onEdit = data => {
    setSelectedItem(data);
    setShowFormDialog(true);
  };
  const onDelete = data => {
    remove(data);
  };
  const onManageSections = data => {
    window.location.href = `/clinicalRecordSections?clinicalRecordTypeId=${data.id}`;
  };
  const onHide = () => {
    setShowFormDialog(false);
    setSelectedItem(null);
  };
  useEffect(() => {
    if (clinicalRecordType && clinicalRecordType.id) {
      setInitialData(ClinicalRecordTypeDtoMapper.toFormBuilderData(clinicalRecordType));
    }
  }, [clinicalRecordType]);
  console.log(clinicalRecordTypes);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toastCreate
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toastUpdate
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toastDelete
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Tipos de Historia Clinica"), /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Tipo de Historia Clinica",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-1"
    }),
    onClick: onCreate
  })), /*#__PURE__*/React.createElement(ClinicalRecordTypesTable, {
    data: clinicalRecordTypes || [],
    onEdit: onEdit,
    onDelete: onDelete,
    loading: isLoadingClinicalRecordTypes,
    onReload: fetchClinicalRecordTypes,
    onManageSections: onManageSections
  }), /*#__PURE__*/React.createElement(ClinicalRecordTypesFormDialog, {
    visible: showFormDialog,
    onHide: onHide,
    onSubmit: onSubmit,
    initialData: initialData,
    loading: isLoadingClinicalRecordType || isLoadingCreate || isLoadingUpdate
  })));
};