function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { RadioButton } from "primereact/radiobutton";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
const DebouncedRadio = ({
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
    className: "d-flex flex-column gap-2"
  }, field.options?.map((option, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(RadioButton, _extends({}, commonProps, {
    inputId: `${fieldName}-${index}`,
    name: fieldName,
    value: option.value,
    checked: value === option.value,
    onChange: e => {
      if (e.checked) onChange(option.value);
    },
    onBlur: controllerField.onBlur
  })), /*#__PURE__*/React.createElement("label", {
    htmlFor: `${fieldName}-${index}`,
    className: "ml-2"
  }, option.label))));
};
export const DynamicRadio = ({
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
    }) => /*#__PURE__*/React.createElement(DebouncedRadio, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps,
      fieldName: fieldName
    })
  });
};