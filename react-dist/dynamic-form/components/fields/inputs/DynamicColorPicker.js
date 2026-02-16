function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { ColorPicker } from "primereact/colorpicker";
import { InputText } from "primereact/inputtext";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
const DebouncedColorPicker = ({
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
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(ColorPicker, _extends({}, commonProps, {
    value: value,
    onChange: e => onChange(e.value),
    onBlur: controllerField.onBlur
  })), /*#__PURE__*/React.createElement(InputText, _extends({}, commonProps, {
    className: "w-100",
    value: value,
    onChange: e => onChange(e.target.value),
    onBlur: controllerField.onBlur
  })));
};
export const DynamicColorPicker = ({
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
    }) => /*#__PURE__*/React.createElement(DebouncedColorPicker, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps
    })
  });
};