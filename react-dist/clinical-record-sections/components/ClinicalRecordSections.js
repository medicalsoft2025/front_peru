import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useClinicalRecordSections } from "../hooks/useClinicalRecordSections.js";
import { ClinicalRecordSectionsTable } from "./ClinicalRecordSectionsTable.js";
import { ClinicalRecordSectionsForm } from "./ClinicalRecordSectionsForm.js";
import { useClinicalRecordType } from "../../clinical-record-types/hooks/useClinicalRecordType.js";
export const ClinicalRecordSections = props => {
  const {
    clinicalRecordTypeId
  } = props;
  const {
    clinicalRecordType
  } = useClinicalRecordType(clinicalRecordTypeId);
  const {
    sections,
    isFetching,
    isSaving,
    save,
    remove,
    reorderSections,
    refetch,
    toastCreate,
    toastUpdate,
    toastDelete
  } = useClinicalRecordSections(clinicalRecordTypeId);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const openNew = () => {
    setSelectedSection(null);
    setShowDialog(true);
  };
  const openEdit = section => {
    // Map data to match form inputs
    const formData = {
      id: section.id,
      clinical_record_type_id: section.clinical_record_type_id,
      dynamic_form_id: section.dynamic_form_id,
      type: section.type,
      label: section.label || '',
      order: section.order
    };
    setSelectedSection(formData);
    setShowDialog(true);
  };
  const handleDelete = async section => {
    remove(section.id);
  };
  const handleSubmit = async data => {
    const success = await save(data);
    if (success) {
      setShowDialog(false);
      setSelectedSection(null);
    }
  };
  const dialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-2"
    }),
    onClick: () => setShowDialog(false),
    className: "p-button-text"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-save me-2"
    }),
    onClick: () => {
      const formElement = document.getElementById('clinical-record-section-form');
      if (formElement) formElement.requestSubmit();
    },
    disabled: isSaving,
    autoFocus: true
  }));
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-0"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toastCreate
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toastUpdate
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toastDelete
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "m-0 fw-bold"
  }, "Secciones: ", clinicalRecordType?.name), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Gestiona las secciones din\xE1micas para este tipo de historia cl\xEDnica"))), /*#__PURE__*/React.createElement(Button, {
    label: "Nueva Secci\xF3n",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-2"
    }),
    onClick: openNew
  })), /*#__PURE__*/React.createElement(ClinicalRecordSectionsTable, {
    data: sections,
    loading: isFetching,
    onEdit: openEdit,
    onDelete: handleDelete,
    onReload: refetch,
    onReorder: reorderSections
  }), /*#__PURE__*/React.createElement(Dialog, {
    visible: showDialog,
    style: {
      width: '450px'
    },
    header: selectedSection ? "Editar Sección" : "Nueva Sección",
    modal: true,
    className: "p-fluid",
    footer: dialogFooter,
    onHide: () => setShowDialog(false)
  }, /*#__PURE__*/React.createElement(ClinicalRecordSectionsForm, {
    formId: "clinical-record-section-form",
    clinicalRecordTypeId: clinicalRecordTypeId,
    initialData: selectedSection,
    onSubmit: handleSubmit
  })));
};