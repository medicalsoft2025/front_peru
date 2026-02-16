function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { Checkbox } from "primereact/checkbox";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
const DebouncedCheckbox = ({
  field,
  controllerField,
  commonProps,
  fieldName
}) => {
  const {
    value,
    onChange
  } = useDebouncedChange({
    field,
    controllerField
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(Checkbox, _extends({}, commonProps, {
    inputId: fieldName,
    checked: value || false,
    onChange: e => onChange(e.checked),
    onBlur: controllerField.onBlur
  })), /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldName,
    className: "form-label ml-2"
  }, field.label, field.required && /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")));
};
export const DynamicCheckbox = ({
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
    defaultValue: field.value !== undefined ? field.value : false,
    disabled: commonProps.disabled,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(DebouncedCheckbox, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps,
      fieldName: fieldName
    })
  });
};