function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
const DebouncedInputNumber = ({
  field,
  controllerField,
  commonProps
}) => {
  const {
    value,
    onChange
  } = useDebouncedChange({
    field,
    controllerField
  });
  return /*#__PURE__*/React.createElement(InputNumber, _extends({}, commonProps, {
    className: "w-100",
    value: value,
    mode: "decimal",
    showButtons: true,
    minFractionDigits: 2,
    onValueChange: e => onChange(e.value),
    onChange: e => onChange(e.value),
    onBlur: controllerField.onBlur
  }));
};
export const DynamicInputNumber = ({
  field,
  form,
  fieldName,
  validationRules,
  commonProps
}) => {
  const {
    control
  } = form;
  return /*#__PURE__*/React.createElement(Controller, {
    name: fieldName,
    control: control,
    rules: validationRules,
    defaultValue: field.value !== undefined ? field.value : 0,
    disabled: commonProps.disabled,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(DebouncedInputNumber, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps
    })
  });
};