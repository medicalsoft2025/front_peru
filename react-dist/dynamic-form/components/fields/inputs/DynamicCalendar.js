function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
const DebouncedCalendar = ({
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
  return /*#__PURE__*/React.createElement(Calendar, _extends({}, commonProps, {
    value: value,
    showIcon: true,
    className: "w-100",
    dateFormat: field.format || "dd/mm/yy",
    showTime: field.type === "datetime",
    hourFormat: "12",
    onChange: e => onChange(e.value),
    onBlur: controllerField.onBlur,
    selectionMode: field.calendarMode || "single"
  }));
};
export const DynamicCalendar = ({
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
    }) => /*#__PURE__*/React.createElement(DebouncedCalendar, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps
    })
  });
};