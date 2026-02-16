function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
import { CascadeSelect } from 'primereact/cascadeselect';
const DebouncedCascadeSelect = ({
  field,
  controllerField,
  commonProps,
  finalOptions,
  loading,
  emptyMessage
}) => {
  const {
    value,
    onChange
  } = useDebouncedChange({
    field,
    controllerField
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CascadeSelect, _extends({}, commonProps, {
    value: value,
    onChange: e => onChange(e.value),
    options: finalOptions,
    optionLabel: "label",
    optionValue: "value",
    optionGroupLabel: "label",
    optionGroupChildren: ['states', 'cities'] //--
    ,
    panelStyle: {
      maxWidth: '300px',
      minWidth: '300px !important'
    },
    className: "w-100",
    loading: loading,
    disabled: commonProps.disabled || loading,
    placeholder: loading ? "Cargando..." : commonProps.placeholder
  })));
};
export const DynamicCascadeSelect = ({
  field,
  form,
  fieldName,
  validationRules,
  commonProps,
  options: propOptions // Rename to avoid name collision
}) => {
  const {
    control
  } = form;

  // Merge options: props > async > static config
  const finalOptions = propOptions && propOptions.length > 0 ? propOptions : field.cascadeOptions || [];
  const emptyMessage = "No hay opciones disponibles";
  return /*#__PURE__*/React.createElement(Controller, {
    name: fieldName,
    control: control,
    rules: validationRules,
    defaultValue: field.value,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "w-100"
    }, /*#__PURE__*/React.createElement(DebouncedCascadeSelect, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps,
      finalOptions: finalOptions,
      loading: false,
      emptyMessage: emptyMessage
    })))
  });
};