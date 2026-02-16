// components/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
const ForgotPasswordModal = ({
  onClose,
  onOTPSent
}) => {
  const [formData, setFormData] = useState({
    nombreCentro: '',
    nombreUsuario: '',
    codPais: '',
    telefono: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = `${window.location.origin}/api/auth/otp/send-otp`;
      const datos = {
        nombre_del_centro_medico: formData.nombreCentro,
        nombre_usuario: formData.nombreUsuario,
        cod_pais: formData.codPais,
        phone: formData.codPais + formData.telefono,
        email: formData.email
      };
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      });
      const data = await response.json();
      if (data.message && data.message.includes("OTP enviado")) {
        await Swal.fire('✅', 'OTP enviado correctamente.', 'success');
        localStorage.setItem("username", formData.nombreUsuario);
        onOTPSent();
      } else {
        throw new Error('Error al enviar OTP');
      }
    } catch (error) {
      console.error("Error:", error);
      await Swal.fire('Error', 'Ocurrió un error al enviar OTP.', 'error');
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "modal fade show d-block",
    style: {
      backgroundColor: 'rgba(0,0,0,0.5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-dialog modal-dialog-centered"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "modal-header text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("img", {
    src: "/logo_monaros_sinbg_light.png",
    style: {
      width: '50%'
    },
    alt: "Logo",
    className: "mb-3"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "btn-close",
    onClick: onClose
  })), /*#__PURE__*/React.createElement("div", {
    className: "modal-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-center"
  }, "Ingresa tus datos para recuperar tu contrase\xF1a."), /*#__PURE__*/React.createElement("form", {
    id: "forgotPasswordForm",
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 input-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "input-group-text"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-hospital"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "nombreCentro",
    className: "form-control",
    placeholder: "Nombre del centro m\xE9dico",
    value: formData.nombreCentro,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 input-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "input-group-text"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-person"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "nombreUsuario",
    className: "form-control",
    placeholder: "Nombre de usuario",
    value: formData.nombreUsuario,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 input-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "input-group-text"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-globe"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "codPais",
    className: "form-control",
    placeholder: "C\xF3digo de pa\xEDs",
    value: formData.codPais,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 input-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "input-group-text"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-telephone"
  })), /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "telefono",
    className: "form-control",
    placeholder: "Tel\xE9fono",
    value: formData.telefono,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3 input-group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "input-group-text"
  }, /*#__PURE__*/React.createElement("i", {
    className: "bi bi-envelope"
  })), /*#__PURE__*/React.createElement("input", {
    type: "email",
    name: "email",
    className: "form-control",
    placeholder: "Correo electr\xF3nico",
    value: formData.email,
    onChange: handleChange,
    required: true
  })), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary w-100",
    disabled: loading
  }, loading ? 'Enviando...' : 'Enviar OTP'))))));
};
export default ForgotPasswordModal;