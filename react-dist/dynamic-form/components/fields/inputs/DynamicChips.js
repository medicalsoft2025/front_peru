function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { Chips } from "primereact/chips";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
const DebouncedChips = ({
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
  return /*#__PURE__*/React.createElement(Chips, _extends({}, commonProps, {
    value: value,
    onChange: e => onChange(e.value),
    onBlur: controllerField.onBlur,
    className: "w-100",
    pt: {
      root: {
        className: "w-100"
      },
      container: {
        className: "w-100"
      }
    }
  }));
};
export const DynamicChips = ({
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
    defaultValue: field.value !== undefined ? field.value : null,
    disabled: commonProps.disabled,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(DebouncedChips, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps
    })
  });
};