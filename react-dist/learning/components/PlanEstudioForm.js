function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
export const PlanEstudioForm = props => {
  const {
    formId = 'planEstudioForm',
    initialData,
    loadingItem,
    onSubmit
  } = props;
  const {
    control,
    handleSubmit,
    reset
  } = useForm();
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);
  if (loadingItem) {
    return /*#__PURE__*/React.createElement("div", null, "Cargando...");
  }
  return /*#__PURE__*/React.createElement("form", {
    id: formId,
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement("input", _extends({
      type: "text"
    }, field, {
      className: "form-control",
      id: "name",
      name: "name",
      required: true
    }))
  }));
};