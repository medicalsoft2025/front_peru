import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useDynamicForm } from "../hooks/useDynamicForm.js";
import { useDynamicFormValuesCreate } from "../hooks/useDynamicFormValuesCreate.js";
import { useDynamicFormValuesUpdate } from "../hooks/useDynamicFormValuesUpdate.js";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
import { useDynamicFormValuesByForm } from "../hooks/useDynamicFormValuesByForm.js";
export const AppFormRenderer = ({
  dynamicFormId,
  initialData,
  onSaveSuccess,
  onCancel,
  showCancelButton = true
}) => {
  const {
    dynamicForm,
    isLoading,
    isFetching
  } = useDynamicForm(dynamicFormId);
  const {
    createDynamicFormValues,
    loading: isLoadingCreate,
    toast: toastCreate
  } = useDynamicFormValuesCreate();
  const {
    updateDynamicFormValues,
    loading: isLoadingUpdate,
    toast: toastUpdate
  } = useDynamicFormValuesUpdate();
  const {
    refetch: refetchDynamicFormValues
  } = useDynamicFormValuesByForm(dynamicFormId || '');
  const [isInvalid, setIsInvalid] = useState(false);
  const dynamicFormRef = useRef(null);
  const [formKey, setFormKey] = useState(0);
  const handleSubmit = () => {
    dynamicFormRef.current?.handleSubmit();
  };
  const onSubmit = async data => {
    let success = false;
    if (initialData?.id) {
      success = await updateDynamicFormValues(initialData.id, data);
    } else {
      success = await createDynamicFormValues(dynamicFormId, data);
    }
    if (success) {
      refetchDynamicFormValues();
      if (!initialData?.id) {
        setFormKey(prev => prev + 1);
      }
      if (onSaveSuccess) onSaveSuccess();
    }
  };
  if (isFetching || isLoading) return /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center p-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner-grow text-primary",
    role: "status"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-muted fw-bold"
  }, "Cargando formulario...")));
  if (!dynamicForm) return /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger shadow-sm border-0 py-4 text-center"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "alert-heading fw-bold"
  }, "Error de Configuraci\xF3n"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, "No se pudo encontrar el formulario con ID: ", /*#__PURE__*/React.createElement("strong", null, dynamicFormId)));
  return /*#__PURE__*/React.createElement("div", {
    className: "app-form-renderer"
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toastCreate
  }), /*#__PURE__*/React.createElement(Toast, {
    ref: toastUpdate
  }), dynamicForm.config && /*#__PURE__*/React.createElement("div", {
    className: "mt-3"
  }, /*#__PURE__*/React.createElement(DynamicForm, {
    key: formKey,
    ref: dynamicFormRef,
    config: dynamicForm.config,
    data: initialData,
    onSubmit: onSubmit,
    onIsInvalidChange: setIsInvalid,
    loading: isLoadingCreate || isLoadingUpdate
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center justify-content-end gap-2 mt-4 pt-3 border-top"
  }, showCancelButton && onCancel && /*#__PURE__*/React.createElement(Button, {
    severity: "secondary",
    type: "button",
    onClick: onCancel,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-2"
    }),
    label: "Cancelar"
  }), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    onClick: handleSubmit,
    disabled: isInvalid || isLoadingCreate || isLoadingUpdate,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-save me-2"
    }),
    label: "Guardar"
  })));
};