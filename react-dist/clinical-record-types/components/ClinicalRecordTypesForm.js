function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useDynamicForms } from "../../app-forms/hooks/useDynamicForms.js";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
import { AppFormsFormDialog } from "../../app-forms/components/AppFormsFormDialog.js";
import { useAppForms } from "../../app-forms/hooks/useAppForms.js";
import { Toast } from 'primereact/toast';
export const ClinicalRecordTypesForm = props => {
  const {
    formId,
    onSubmit,
    initialData
  } = props;
  const defaultValues = {
    name: "",
    dynamic_form_id: null
  };
  const [showFormPreviewDialog, setShowFormPreviewDialog] = useState(false);
  const [showFormEditorDialog, setShowFormEditorDialog] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: initialData || defaultValues,
    mode: "onChange"
  });
  const {
    dynamicForms
  } = useDynamicForms();
  const dynamicFormId = useWatch({
    control,
    name: "dynamic_form_id"
  });
  const dynamicForm = dynamicForms?.find(form => form.id == dynamicFormId);
  const {
    save,
    isFetchingForm: isLoadingForm,
    toastCreate: toastCreateForm
  } = useAppForms();
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  useEffect(() => {
    reset(initialData || defaultValues);
  }, [initialData]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toastCreateForm
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    id: formId
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: "El nombre es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name",
      className: "form-label"
    }, "Nombre *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: "name"
    }, field, {
      className: "w-100"
    })))
  }), getFormErrorMessage("name")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "dynamic_form_id",
    control: control,
    rules: {
      required: "El formulario dinámico es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-end gap-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column flex-grow-1"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "dynamic_form_id",
      className: "form-label"
    }, "Formulario din\xE1mico *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: "dynamic_form_id",
      inputId: "dynamic_form_id"
    }, field, {
      options: dynamicForms,
      optionLabel: "name",
      optionValue: "id",
      placeholder: "Seleccionar",
      className: "w-100"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-1"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-plus"
      }),
      type: "button",
      onClick: () => {
        setShowFormEditorDialog(true);
      }
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-eye"
      }),
      type: "button",
      disabled: !dynamicForm,
      onClick: () => {
        setShowFormPreviewDialog(true);
      }
    }))))
  }), getFormErrorMessage("dynamic_form_id"))), /*#__PURE__*/React.createElement(Dialog, {
    visible: showFormPreviewDialog,
    onHide: () => setShowFormPreviewDialog(false),
    header: `Previsualizar Formulario | ${dynamicForm?.name}`,
    style: {
      width: '100vw'
    },
    maximizable: true
  }, dynamicForm && /*#__PURE__*/React.createElement(DynamicForm, {
    config: dynamicForm?.config || {},
    onSubmit: () => {}
  })), /*#__PURE__*/React.createElement(AppFormsFormDialog, {
    visible: showFormEditorDialog,
    onHide: () => setShowFormEditorDialog(false),
    onSubmit: save,
    loading: isLoadingForm
  }));
};