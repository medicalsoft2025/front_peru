import React, { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useCompanies } from "../hooks/useCompanies";
import { FeCompanyCreate } from "../interfaces/feCompanies.model";

export const FeConfigurationForm = () => {
  const toast = useRef<Toast>(null);
  const { companies, getCompanies, createCompany, updateCompany, loading, error } = useCompanies();
  const [forms, setForms] = useState<Record<string, FeCompanyCreate>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetch = async () => {
      const data = await getCompanies();
      const initialForms: Record<string, FeCompanyCreate> = {};

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
          certificado_file: undefined,
        };
      } else {
        data.forEach((company: any) => {
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
            certificado_file: undefined,
          };
        });
      }

      setForms(initialForms);
    };

    fetch();
  }, [getCompanies]);

  const handleChange = (key: string, field: string, value: any) => {
    setForms((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };



const handleSave = async (key: string) => {
  try {
    setSaving((prev) => ({ ...prev, [key]: true }));
    const formData = forms[key];

    // Crear un payload plano, sin archivos
    const payload = { ...formData };

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
      life: 4000,
    });

    // Opcional: refrescar lista de compañías
    await getCompanies();

  } catch (err: any) {
    toast.current?.show({
      severity: "error",
      summary: "Error",
      detail: err?.message || "No se pudo guardar la configuración",
      life: 5000,
    });
  } finally {
    setSaving((prev) => ({ ...prev, [key]: false }));
  }
};

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "200px" }}>
        <ProgressSpinner />
        <p>Cargando configuración...</p>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red" }}>Error al cargar compañías: {error.message || error}</p>;
  }

  return (
  <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
    <Toast ref={toast} />

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
        gap: "20px",
      }}
    >
      {Object.entries(forms).map(([key, form]) => {
        const isSaving = saving[key] || false;
        const isNew = key === "new";

        return (
          <Card key={key} title={isNew ? "Crear nueva compañía" : form.razon_social}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <InputText placeholder="RUC" value={form.ruc} onChange={(e) => handleChange(key, "ruc", e.target.value)} />
              <InputText placeholder="Razón social" value={form.razon_social} onChange={(e) => handleChange(key, "razon_social", e.target.value)} />
              <InputText placeholder="Nombre comercial" value={form.nombre_comercial} onChange={(e) => handleChange(key, "nombre_comercial", e.target.value)} />
              <InputText placeholder="Dirección" value={form.direccion} onChange={(e) => handleChange(key, "direccion", e.target.value)} />
              <InputText
  placeholder="Email principal"
  value={form.email}
  onChange={(e) => handleChange(key, "email", e.target.value)}
/>

              <InputText placeholder="Ubigeo" value={form.ubigeo} onChange={(e) => handleChange(key, "ubigeo", e.target.value)} />
              <InputText placeholder="Distrito" value={form.distrito} onChange={(e) => handleChange(key, "distrito", e.target.value)} />
              <InputText placeholder="Provincia" value={form.provincia} onChange={(e) => handleChange(key, "provincia", e.target.value)} />
              <InputText placeholder="Departamento" value={form.departamento} onChange={(e) => handleChange(key, "departamento", e.target.value)} />
              <InputText placeholder="Usuario SOL" value={form.usuario_sol} onChange={(e) => handleChange(key, "usuario_sol", e.target.value)} />
              <Password placeholder="Clave SOL" value={form.clave_sol} onChange={(e) => handleChange(key, "clave_sol", e.target.value)} feedback={false} toggleMask />
              <Password placeholder="Password certificado" value={form.certificado_password} onChange={(e) => handleChange(key, "certificado_password", e.target.value)} feedback={false} toggleMask />
              {/* <InputText type="file" accept=".pfx,.pem" onChange={(e) => handleChange(key, "certificado_file", e.target.files?.[0] || undefined)} /> */}

              <Button
                label={isSaving ? "Guardando..." : isNew ? "Crear compañía" : "Guardar cambios"}
                onClick={() => handleSave(key)}
                disabled={isSaving}
              />
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

};
