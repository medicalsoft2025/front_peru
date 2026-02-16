function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { Dropdown } from "primereact/dropdown";
import React from "react";
import { Controller } from "react-hook-form";
export const DynamicControlledField = props => {
  const {
    field,
    form,
    parentPath = "",
    className = ""
  } = props;
  const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;
  const {
    control
  } = form;
  const validationRules = {
    required: field.required ? "Este campo es requerido" : false,
    ...field.validation
  };

  // Valor por defecto
  const defaultValue = field.value !== undefined ? field.value : field.type === "checkbox" ? false : field.type === "number" ? 0 : field.type === "multiselect" ? [] : "";
  const commonProps = {
    id: fieldName,
    className: `field-input ${className}`,
    disabled: field.disabled,
    placeholder: field.placeholder
  };
  return /*#__PURE__*/React.createElement(Controller, {
    name: fieldName,
    control: control,
    rules: validationRules,
    defaultValue: defaultValue,
    render: ({
      field: controllerField
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, commonProps, {
      value: controllerField.value,
      options: field.options || [],
      optionLabel: "label",
      optionValue: "value",
      onChange: e => controllerField.onChange(e.value),
      onBlur: controllerField.onBlur
    }))
  });
};