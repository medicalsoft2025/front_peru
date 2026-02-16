function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
import { TreeSelect } from "primereact/treeselect";
const DebouncedTreeSelect = ({
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
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(TreeSelect, _extends({}, commonProps, {
    value: value,
    onChange: e => onChange(e.value),
    options: finalOptions,
    disabled: commonProps.disabled || loading,
    placeholder: loading ? "Cargando..." : commonProps.placeholder,
    className: "w-100"
  })));
};
export const DynamicTreeSelect = ({
  field,
  form,
  fieldName,
  validationRules,
  commonProps,
  options: propOptions
}) => {
  const {
    control
  } = form;
  const finalOptions = propOptions && propOptions.length > 0 ? propOptions : field.treeOptions || [];
  const emptyMessage = "No hay opciones disponibles";
  return /*#__PURE__*/React.createElement(Controller, {
    name: fieldName,
    control: control,
    rules: validationRules,
    defaultValue: field.value,
    disabled: commonProps.disabled,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DebouncedTreeSelect, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps,
      finalOptions: finalOptions,
      loading: false,
      emptyMessage: emptyMessage
    }))
  });
};