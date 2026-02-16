import React, { useMemo, useRef, useEffect } from "react";
import { useCreateTenant } from "../hooks/useCreateTenant.js";
import { useCompanies } from "../hooks/useCompanies.js";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { FeConfigurationForm } from "./FeConfigurationForm.js";
export const FeIntegrationsForm = () => {
  const toast = useRef(null);
  const {
    companies,
    getCompanies,
    loading: companiesLoading,
    feStatus,
    error: companiesError
  } = useCompanies();
  const {
    createTenant,
    loading,
    step,
    error,
    success
  } = useCreateTenant();
  const {
    tenantId,
    domain
  } = useMemo(() => {
    const {
      hostname
    } = window.location;
    return {
      tenantId: hostname.split(".")[0],
      domain: hostname
    };
  }, []);
  useEffect(() => {
    getCompanies().catch(console.error);
  }, [getCompanies]);
  const handleActivateFE = async () => {
    try {
      const tenant = await createTenant({
        id: tenantId,
        domain
      });
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `Facturación electrónica activada para ${tenant.id}`,
        life: 4000
      });
      await getCompanies();
    } catch (e) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: e?.message || "No se pudo activar la facturación electrónica",
        life: 5000
      });
    }
  };
  if (companiesLoading && feStatus === "unknown") {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(ProgressSpinner, null), /*#__PURE__*/React.createElement("p", null, "Verificando estado de facturaci\xF3n electr\xF3nica..."));
  }
  if (companiesError) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: "center",
        padding: 40
      }
    }, /*#__PURE__*/React.createElement(Toast, {
      ref: toast
    }), !loading ? /*#__PURE__*/React.createElement(Button, {
      label: "Activar facturaci\xF3n electr\xF3nica",
      onClick: handleActivateFE,
      className: "p-button-success"
    }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProgressSpinner, null), /*#__PURE__*/React.createElement("p", null, step === "creating" && "Creando tenant...", step === "migrating" && "Ejecutando migraciones...", step === "seeding" && "Ejecutando seeders...")), error && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "red"
      }
    }, error), success && /*#__PURE__*/React.createElement("p", {
      style: {
        color: "green"
      }
    }, "Facturaci\xF3n activada correctamente"));
  }

  /* ✅ Si el endpoint responde ok (aunque sea data vacía) → mostrar formulario */
  return /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: "0 auto",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }), /*#__PURE__*/React.createElement("h2", null, "Integraci\xF3n de Facturaci\xF3n Electr\xF3nica"), /*#__PURE__*/React.createElement(FeConfigurationForm, null));
};