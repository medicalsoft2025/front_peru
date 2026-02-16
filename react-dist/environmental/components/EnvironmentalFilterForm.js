function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
export const EnvironmentalFilterForm = ({
  formId,
  onSubmit,
  type,
  initialValues
}) => {
  const {
    control,
    handleSubmit,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: {
      name: ''
    }
  });
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    } else {
      reset({
        name: ''
      });
    }
  }, [initialValues, reset]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit),
    id: formId
  }, /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: true
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column gap-2 mb-3"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name",
      className: "form-label"
    }, "Nombre"), /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      placeholder: "Nombre",
      className: `w-100 ${classNames({
        'p-invalid': errors.name
      })}`
    }))))
  })));
};