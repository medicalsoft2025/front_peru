function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";
export const TicketForm = ({
  visible,
  onHide,
  onSave
}) => {
  const defaultValues = {
    subject: "",
    stepsToReproduce: "",
    expectedResults: "",
    tags: [],
    frequency: null,
    message: "",
    files: null
  };
  const {
    control,
    handleSubmit,
    reset,
    register
  } = useForm({
    defaultValues
  });
  const frequencyOptions = [{
    label: "Siempre",
    value: "always"
  }, {
    label: "A veces",
    value: "sometimes"
  }, {
    label: "Rara vez",
    value: "rarely"
  }, {
    label: "Solo una vez",
    value: "once"
  }];
  const tagOptions = [{
    label: "Error",
    value: "bug"
  }, {
    label: "Mejora",
    value: "feature"
  }, {
    label: "Pregunta",
    value: "question"
  }, {
    label: "Diseño",
    value: "design"
  }];
  const onSubmit = data => {
    onSave(data);
    reset();
  };
  const handleHide = () => {
    reset();
    onHide();
  };
  const footer = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: "pi pi-times",
    onClick: handleHide,
    className: "p-button-text"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: "pi pi-check",
    onClick: handleSubmit(onSubmit),
    autoFocus: true
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Crear Ticket",
    visible: visible,
    style: {
      width: '50vw'
    },
    onHide: handleHide,
    footer: footer
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "subject",
    className: "form-label"
  }, "Asunto"), /*#__PURE__*/React.createElement(Controller, {
    name: "subject",
    control: control,
    rules: {
      required: 'El asunto es obligatorio'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(InputText, _extends({
      id: "subject"
    }, field, {
      className: `w-100 ${fieldState.invalid ? 'p-invalid' : ''}`
    })), fieldState.error && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldState.error.message))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "stepsToReproduce",
    className: "form-label"
  }, "Pasos para reproducir"), /*#__PURE__*/React.createElement(Controller, {
    name: "stepsToReproduce",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "stepsToReproduce"
    }, field, {
      rows: 3,
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "expectedResults",
    className: "form-label"
  }, "Resultados esperados"), /*#__PURE__*/React.createElement(Controller, {
    name: "expectedResults",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "expectedResults"
    }, field, {
      rows: 3,
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "tags",
    className: "form-label"
  }, "Etiquetas"), /*#__PURE__*/React.createElement(Controller, {
    name: "tags",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(MultiSelect, {
      id: "tags",
      value: field.value,
      options: tagOptions,
      onChange: e => field.onChange(e.value),
      placeholder: "Selecciona etiquetas",
      display: "chip",
      className: "w-100"
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "frequency",
    className: "form-label"
  }, "Frecuencia"), /*#__PURE__*/React.createElement(Controller, {
    name: "frequency",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: "frequency",
      value: field.value,
      options: frequencyOptions,
      onChange: e => field.onChange(e.value),
      placeholder: "Selecciona frecuencia",
      className: "w-100"
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "message",
    className: "form-label"
  }, "Mensaje"), /*#__PURE__*/React.createElement(Controller, {
    name: "message",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "message"
    }, field, {
      rows: 5,
      className: "w-100"
    }))
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "attachments",
    className: "form-label"
  }, "Adjuntar archivos"), /*#__PURE__*/React.createElement("input", _extends({
    className: "form-control",
    type: "file",
    id: "attachments",
    multiple: true
  }, register("files")))))));
};