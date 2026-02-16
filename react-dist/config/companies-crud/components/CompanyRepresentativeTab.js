function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { companyService } from "../../../../services/api/index.js";
export const CompanyRepresentativeTab = ({
  companyId,
  initialRepresentative
}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {
      errors,
      isValid,
      isDirty
    },
    reset
  } = useForm({
    defaultValues: initialRepresentative || {
      name: '',
      phone: '',
      email: '',
      document_type: '',
      document_number: ''
    },
    mode: 'onChange'
  });
  useEffect(() => {
    if (initialRepresentative) {
      reset(initialRepresentative);
    } else {
      reset({
        name: '',
        phone: '',
        email: '',
        document_type: '',
        document_number: ''
      });
    }
  }, [initialRepresentative, reset]);
  const documentTypes = [{
    label: 'RNC',
    value: 'RNC'
  }, {
    label: 'PASSPORTE',
    value: 'PASSPORT'
  }, {
    label: 'NIT',
    value: 'NIT'
  }, {
    label: 'CEDULA DE CIUDADANIA',
    value: 'CC'
  }];
  const onSubmit = async data => {
    if (!companyId) {
      SwalManager.error('Debe guardar la empresa antes de agregar el representante.');
      return;
    }
    setLoading(true);
    try {
      let response;
      // Use local data.id determines if it is an update or create?
      // Wait, data coming from form might default to ID if we reset with it.
      // But if initialRepresentative is null, data.id is undefined.
      const isUpdate = !!(initialRepresentative && initialRepresentative.id);
      if (isUpdate) {
        // Ensure we send the ID if it's an update
        const payload = {
          ...data,
          id: initialRepresentative?.id
        };
        response = await companyService.updateRepresentative(companyId, payload);
        SwalManager.success('Representante Legal actualizado correctamente');
      } else {
        response = await companyService.createRepresentative(companyId, data);
        SwalManager.success('Representante Legal creado correctamente');
      }
    } catch (error) {
      console.error('Error saving representative:', error);
      SwalManager.error('Error al guardar el representante');
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit(onSubmit)
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold mb-3"
  }, "Informaci\xF3n del Representante Legal"), !companyId && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-warning"
  }, "Guarde la informaci\xF3n general de la empresa para habilitar esta secci\xF3n.")), /*#__PURE__*/React.createElement("div", {
    className: "col-12 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name",
    className: "form-label"
  }, "Nombre Completo ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "name",
    control: control,
    rules: {
      required: 'El nombre del Representante no puede estar vacío',
      minLength: {
        value: 2,
        message: 'El nombre debe tener al menos 2 caracteres'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "name",
      className: `form-control ${errors.name ? 'is-invalid' : ''}`,
      placeholder: "Jhon Doe",
      disabled: !companyId
    }))
  }), errors.name && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.name.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "phone",
    className: "form-label"
  }, "Tel\xE9fono"), /*#__PURE__*/React.createElement(Controller, {
    name: "phone",
    control: control,
    rules: {
      pattern: {
        value: /^\+?[\d\s\-\(\)]+$/,
        message: 'Formato de teléfono inválido'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "phone",
      className: `form-control ${errors.phone ? 'is-invalid' : ''}`,
      placeholder: "+57 300 123 4567",
      disabled: !companyId
    }))
  }), errors.phone && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.phone.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "email",
    className: "form-label"
  }, "Correo Electr\xF3nico"), /*#__PURE__*/React.createElement(Controller, {
    name: "email",
    control: control,
    rules: {
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Formato de email inválido'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "email",
      className: `form-control ${errors.email ? 'is-invalid' : ''}`,
      placeholder: "ejemplo@correo.com",
      disabled: !companyId
    }))
  }), errors.email && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.email.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "document_type",
    className: "form-label"
  }, "Tipo de Documento ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "document_type",
    control: control,
    rules: {
      required: 'Seleccione un Tipo de Documento'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({}, field, {
      id: "document_type",
      options: documentTypes,
      placeholder: "Seleccione un tipo de documento",
      className: `w-100 ${errors.document_type ? 'is-invalid' : ''}`,
      disabled: !companyId
    }))
  }), errors.document_type && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.document_type.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "document_number",
    className: "form-label"
  }, "N\xFAmero de Documento ", /*#__PURE__*/React.createElement("span", {
    className: "text-danger"
  }, "*")), /*#__PURE__*/React.createElement(Controller, {
    name: "document_number",
    control: control,
    rules: {
      required: 'El Documento no puede estar vacío',
      minLength: {
        value: 3,
        message: 'El documento debe tener al menos 3 caracteres'
      }
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputText, _extends({}, field, {
      id: "document_number",
      className: `form-control ${errors.document_number ? 'is-invalid' : ''}`,
      placeholder: "123456789",
      disabled: !companyId
    }))
  }), errors.document_number && /*#__PURE__*/React.createElement("div", {
    className: "invalid-feedback d-block"
  }, errors.document_number.message))), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    label: "Guardar Representante",
    icon: "pi pi-save",
    loading: loading,
    className: "p-button-primary",
    disabled: !companyId || !isValid
  }))))));
};