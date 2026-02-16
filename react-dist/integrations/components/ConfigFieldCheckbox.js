import React, { useEffect, useState } from "react";
import { Checkbox } from "primereact/checkbox";
export const ConfigFieldCheckbox = props => {
  const {
    field,
    label,
    initialValue,
    onChange
  } = props;
  const [value, setValue] = useState(false);
  const handleValueChange = e => {
    setValue(e.target.checked);
    onChange(e.target.checked);
  };
  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(Checkbox, {
    inputId: field,
    checked: value,
    onChange: handleValueChange
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: label,
    className: "form-label ml-2"
  }, label)));
};