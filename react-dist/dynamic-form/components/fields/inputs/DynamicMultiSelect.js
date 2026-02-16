function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { MultiSelect } from "primereact/multiselect";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
import { useAsyncOptions } from "../../../hooks/useAsyncOptions.js";
const DebouncedMultiSelect = ({
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
  return /*#__PURE__*/React.createElement(MultiSelect, _extends({}, commonProps, {
    value: value || [],
    options: finalOptions,
    className: "w-100",
    optionLabel: "label",
    optionValue: "value",
    onChange: e => onChange(e.value),
    onBlur: controllerField.onBlur,
    display: "chip",
    disabled: commonProps.disabled || loading,
    placeholder: loading ? "Cargando..." : commonProps.placeholder,
    emptyMessage: emptyMessage
  }));
};
export const DynamicMultiSelect = ({
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
  const {
    options: asyncOptions,
    loading
  } = useAsyncOptions({
    config: field.asyncOptions,
    fieldName
  });
  const finalOptions = propOptions && propOptions.length > 0 ? propOptions : asyncOptions && asyncOptions.length > 0 ? asyncOptions : field.options || [];
  const emptyMessage = loading ? "Cargando..." : "No hay opciones disponibles";
  return /*#__PURE__*/React.createElement(Controller, {
    name: fieldName,
    control: control,
    rules: validationRules,
    defaultValue: field.value !== undefined ? field.value : [],
    disabled: commonProps.disabled,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(DebouncedMultiSelect, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps,
      finalOptions: finalOptions,
      loading: loading,
      emptyMessage: emptyMessage
    })
  });
};