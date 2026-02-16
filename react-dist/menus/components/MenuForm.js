function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { useDynamicForms } from "../../app-forms/hooks/useDynamicForms.js";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
import { AppFormsFormDialog } from "../../app-forms/components/AppFormsFormDialog.js";
import { useAppForms } from "../../app-forms/hooks/useAppForms.js";
export const MenuForm = ({
  visible,
  onHide,
  onSubmit,
  defaultValues,
  mode,
  isSystemMenu
}) => {
  const [showFormPreviewDialog, setShowFormPreviewDialog] = useState(false);
  const [showFormEditorDialog, setShowFormEditorDialog] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      label: '',
      icon: '',
      dynamic_form_id: null
    }
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
  useEffect(() => {
    if (visible) {
      reset(defaultValues || {
        label: '',
        icon: '',
        dynamic_form_id: null
      });
    }
  }, [visible, defaultValues, reset]);
  const submitForm = data => {
    onSubmit(data);
    onHide();
  };
  const getFormErrorMessage = name => {
    return errors[name] && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, errors[name].message);
  };
  const footer = /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 justify-content-end align-items-center"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-1"
    }),
    onClick: onHide,
    severity: "secondary",
    type: "button"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-check me-1"
    }),
    onClick: handleSubmit(submitForm),
    type: "submit"
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Dialog, {
    header: mode === 'create' ? "Nuevo Menú" : "Editar Menú",
    visible: visible,
    style: {
      width: '50vw'
    },
    footer: footer,
    onHide: onHide
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(submitForm),
    className: "p-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "label",
    className: "form-label"
  }, "Etiqueta"), /*#__PURE__*/React.createElement(Controller, {
    name: "label",
    control: control,
    rules: {
      required: 'La etiqueta es requerida'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, _extends({
      id: "label"
    }, field, {
      className: classNames({
        'p-invalid': fieldState.invalid
      })
    })), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  }))), /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "icon",
    className: "form-label"
  }, "Icono (Clase CSS)"), /*#__PURE__*/React.createElement(Controller, {
    name: "icon",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({
      id: "icon"
    }, field))
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Ejemplo: fa fa-home"))), !isSystemMenu && /*#__PURE__*/React.createElement("div", {
    className: "row mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
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
  }), getFormErrorMessage("dynamic_form_id"))))), /*#__PURE__*/React.createElement(Dialog, {
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