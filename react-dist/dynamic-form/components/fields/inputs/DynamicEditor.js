function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React from "react";
import { Controller } from "react-hook-form";
import { Editor } from "primereact/editor";
import { useDebouncedChange } from "../../../hooks/useDebouncedChange.js";
const DebouncedEditor = ({
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
  return /*#__PURE__*/React.createElement(Editor, _extends({}, commonProps, {
    value: value,
    onTextChange: e => onChange(e.htmlValue),
    style: {
      height: "200px"
    }
  }));
};
export const DynamicEditor = ({
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
    }) => /*#__PURE__*/React.createElement(DebouncedEditor, {
      field: field,
      controllerField: controllerField,
      commonProps: commonProps
    })
  });
};