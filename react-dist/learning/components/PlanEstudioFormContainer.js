import React from 'react';
import { useLocalStorageContext } from "../context/LocalStorageContext.js";
import { PlanEstudioForm } from "./PlanEstudioForm.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const PlanEstudioFormContainer = props => {
  const {
    onCancel,
    onSuccess
  } = props;
  const formId = "planEstudioForm";
  const {
    selectedItem,
    loadingItem,
    saveItem
  } = useLocalStorageContext();
  const {
    toast,
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const onSubmit = async data => {
    try {
      await saveItem(data);
      showSuccessToast({
        title: 'Éxito',
        message: 'Item guardado exitosamente'
      });
      onSuccess();
    } catch (error) {
      showServerErrorsToast(error);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PlanEstudioForm, {
    formId: formId,
    onSubmit: onSubmit,
    initialData: selectedItem || undefined,
    loadingItem: loadingItem
  }), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn btn-secondary",
    onClick: onCancel
  }, "Cancelar"), /*#__PURE__*/React.createElement("button", {
    form: formId,
    type: "submit",
    className: "btn btn-primary"
  }, "Guardar")));
};