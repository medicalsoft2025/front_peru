import React, { useEffect } from 'react';
import { AppFormsFormDialog } from "./AppFormsFormDialog.js";
import { Button } from 'primereact/button';
import { AppFormsTable } from "./AppFormsTable.js";
import { DynamicFormMapper } from "../mappers/mappers.js";
import { Toast } from 'primereact/toast';
import { useAppForms } from "../hooks/useAppForms.js";
export const AppForms = () => {
  const [showFormDialog, setShowFormDialog] = React.useState(false);
  const [initialData, setInitialData] = React.useState(null);
  const {
    save,
    remove,
    toastCreate,
    toastUpdate,
    toastDelete,
    dynamicForms,
    isFetchingForms,
    dynamicForm,
    isFetchingForm,
    setSelectedForm,
    refetchForms
  } = useAppForms();
  const onCreate = () => {
    setSelectedForm(null);
    setInitialData(null);
    setShowFormDialog(true);
  };
  const onEdit = data => {
    setSelectedForm(data);
    setShowFormDialog(true);
  };
  const onHide = () => {
    setShowFormDialog(false);
    setSelectedForm(null);
  };
  useEffect(() => {
    if (dynamicForm && dynamicForm.id) {
      setInitialData(DynamicFormMapper.toFormBuilderData(dynamicForm));
    }
  }, [dynamicForm]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toastCreate
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toastUpdate
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toastDelete
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Formularios"), /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Formulario",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-1"
    }),
    onClick: onCreate
  })), /*#__PURE__*/React.createElement(AppFormsTable, {
    data: dynamicForms || [],
    onEdit: onEdit,
    onDelete: remove,
    loading: isFetchingForms,
    onReload: refetchForms
  }), /*#__PURE__*/React.createElement(AppFormsFormDialog, {
    visible: showFormDialog,
    onHide: onHide,
    onSubmit: save,
    initialData: initialData,
    loading: isFetchingForm
  })));
};