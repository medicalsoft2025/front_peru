import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useCompanies } from "../hooks/useCompanies.js";
export const FeConfigurationForm = () => {
  const toast = useRef(null);
  const {
    companies,
    getCompanies,
    createCompany,
    updateCompany,
    loading,
    error
  } = useCompanies();
  const [forms, setForms] = useState({});
  const [saving, setSaving] = useState({});
  useEffect(() => {
    const fetch = async () => {
      const data = await getCompanies();
      const initialForms = {};
      if (data.length === 0) {
        initialForms["new"] = {
          ruc: "",
          razon_social: "",
          nombre_comercial: "",
          direccion: "",
          ubigeo: "",
          distrito: "",
          provincia: "",
          departamento: "",
          email: "",
          usuario_sol: "",
          clave_sol: "",
          certificado_password: "",
          certificado_file: undefined
        };
      } else {
        data.forEach(company => {
          initialForms[company.id] = {
            ruc: company.taxId || "",
            razon_social: company.name || "",
            nombre_comercial: company.name || "",
            direccion: company.address || "",
            ubigeo: company.ubigeo || "",
            distrito: company.city || "",
            provincia: company.province || "",
            departamento: company.region || "",
            email: company.email || "",
            usuario_sol: company.usuario_sol || "",
            clave_sol: company.clave_sol || "",
            certificado_password: "",
            certificado_file: undefined
          };
        });
      }
      setForms(initialForms);
    };
    fetch();
  }, [getCompanies]);
  const handleChange = (key, field, value) => {
    setForms(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };
  const handleSave = async key => {
    try {
      setSaving(prev => ({
        ...prev,
        [key]: true
      }));
      const formData = forms[key];

      // Crear un payload plano, sin archivos
      const payload = {
        ...formData
      };
      if (key === "new") {
        // Crear nueva compañía
        await createCompany(payload);
      } else {
        // Actualizar compañía existente
        await updateCompany(key, payload);
      }
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Configuración guardada correctamente",
        life: 4000
      });

      // Opcional: refrescar lista de compañías
      await getCompanies();
    } catch (err) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: err?.message || "No se pudo guardar la configuración",
        life: 5000
      });
    } finally {
      setSaving(prev => ({
        ...prev,
        [key]: false
      }));
    }
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null), /*#__PURE__*/React.createElement("p", null, "Cargando configuraci\xF3n..."));
  }
  if (error) {
    return /*#__PURE__*/React.createElement("p", {
      style: {
        color: "red"
      }
    }, "Error al cargar compa\xF1\xEDas: ", error.message || error);
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto"
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
      gap: "20px"
    }
  }, Object.entries(forms).map(([key, form]) => {
    const isSaving = saving[key] || false;
    const isNew = key === "new";
    return /*#__PURE__*/React.createElement(Card, {
      key: key,
      title: isNew ? "Crear nueva compañía" : form.razon_social
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }
    }, /*#__PURE__*/React.createElement(InputText, {
      placeholder: "RUC",
      value: form.ruc,
      onChange: e => handleChange(key, "ruc", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Raz\xF3n social",
      value: form.razon_social,
      onChange: e => handleChange(key, "razon_social", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Nombre comercial",
      value: form.nombre_comercial,
      onChange: e => handleChange(key, "nombre_comercial", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Direcci\xF3n",
      value: form.direccion,
      onChange: e => handleChange(key, "direccion", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Email principal",
      value: form.email,
      onChange: e => handleChange(key, "email", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Ubigeo",
      value: form.ubigeo,
      onChange: e => handleChange(key, "ubigeo", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Distrito",
      value: form.distrito,
      onChange: e => handleChange(key, "distrito", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Provincia",
      value: form.provincia,
      onChange: e => handleChange(key, "provincia", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Departamento",
      value: form.departamento,
      onChange: e => handleChange(key, "departamento", e.target.value)
    }), /*#__PURE__*/React.createElement(InputText, {
      placeholder: "Usuario SOL",
      value: form.usuario_sol,
      onChange: e => handleChange(key, "usuario_sol", e.target.value)
    }), /*#__PURE__*/React.createElement(Password, {
      placeholder: "Clave SOL",
      value: form.clave_sol,
      onChange: e => handleChange(key, "clave_sol", e.target.value),
      feedback: false,
      toggleMask: true
    }), /*#__PURE__*/React.createElement(Password, {
      placeholder: "Password certificado",
      value: form.certificado_password,
      onChange: e => handleChange(key, "certificado_password", e.target.value),
      feedback: false,
      toggleMask: true
    }), /*#__PURE__*/React.createElement(Button, {
      label: isSaving ? "Guardando..." : isNew ? "Crear compañía" : "Guardar cambios",
      onClick: () => handleSave(key),
      disabled: isSaving
    })));
  })));
};