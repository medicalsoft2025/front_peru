function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { InputTextarea } from "primereact/inputtextarea";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
const DebouncedInputTextarea = ({
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
  return /*#__PURE__*/React.createElement(InputTextarea, _extends({}, commonProps, {
    className: "w-100",
    value: value,
    rows: field.rows || 4,
    onChange: e => onChange(e.target.value),
    onBlur: controllerField.onBlur
  }));
};
export const DynamicInputTextarea = ({
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
    defaultValue: field.value !== undefined ? field.value : "",
    disabled: commonProps.disabled,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(DebouncedInputTextarea, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps
    })
  });
};