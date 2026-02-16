function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useDynamicForms } from "../../app-forms/hooks/useDynamicForms.js";
import { useAppForms } from "../../app-forms/hooks/useAppForms.js";
import { AppFormsFormDialog } from "../../app-forms/components/AppFormsFormDialog.js";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
import { Toast } from 'primereact/toast';
export const ClinicalRecordSectionsForm = props => {
  const {
    formId,
    onSubmit,
    initialData,
    clinicalRecordTypeId
  } = props;
  const defaultValues = {
    clinical_record_type_id: clinicalRecordTypeId,
    dynamic_form_id: null,
    type: 'finish_modal_tab',
    label: '',
    order: 0
  };
  const [showFormPreviewDialog, setShowFormPreviewDialog] = useState(false);
  const [showFormEditorDialog, setShowFormEditorDialog] = useState(false);
  const {
    handleSubmit,
    control,
    reset,
    formState: {
      errors
    },
    setValue
  } = useForm({
    defaultValues: initialData || defaultValues,
    mode: "onChange"
  });
  const {
    dynamicForms
  } = useDynamicForms();
  const {
    save,
    isFetchingForm: isLoadingForm,
    toastCreate: toastCreateForm
  } = useAppForms();
  const dynamicFormId = useWatch({
    control,
    name: "dynamic_form_id"
  });
  const dynamicForm = dynamicForms?.find(form => form.id == dynamicFormId);
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        ...defaultValues,
        clinical_record_type_id: clinicalRecordTypeId
      });
    }
  }, [initialData, clinicalRecordTypeId, reset]);
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const typeOptions = [{
    label: 'Tab en ventana de finalizar consulta',
    value: 'finish_modal_tab'
  }];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: toastCreateForm
  }), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    id: formId
  }, /*#__PURE__*/React.createElement("input", _extends({
    type: "hidden"
  }, control.register('clinical_record_type_id'))), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "label",
    control: control,
    rules: {
      required: "El label es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "label",
      className: "form-label"
    }, "Label *"), /*#__PURE__*/React.createElement(InputText, _extends({
      id: "label"
    }, field, {
      className: "w-100"
    })))
  }), getFormErrorMessage("label")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column mb-3"
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "type",
    control: control,
    rules: {
      required: "El tipo es requerido"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
      htmlFor: "type",
      className: "form-label"
    }, "Tipo *"), /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: "type"
    }, field, {
      options: typeOptions,
      className: "w-100"
    })))
  }), getFormErrorMessage("type")), /*#__PURE__*/React.createElement("div", {
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
      },
      tooltip: "Crear nuevo formulario"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-eye"
      }),
      type: "button",
      disabled: !dynamicForm,
      onClick: () => {
        setShowFormPreviewDialog(true);
      },
      tooltip: "Previsualizar"
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
    onSubmit:
    // Wrap save to refresh dynamicForms list if needed, usually hooks share query cache
    save,
    loading: isLoadingForm
  }));
};