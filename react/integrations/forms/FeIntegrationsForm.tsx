import React, { useMemo, useRef, useEffect } from "react";
import { useCreateTenant } from "../hooks/useCreateTenant";
import { useCompanies } from "../hooks/useCompanies";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { FeConfigurationForm } from "./FeConfigurationForm";

export const FeIntegrationsForm = () => {
  const toast = useRef<Toast>(null);
  const { companies, getCompanies, loading: companiesLoading, feStatus, error: companiesError } = useCompanies();
  const { createTenant, loading, step, error, success } = useCreateTenant();

  const { tenantId, domain } = useMemo(() => {
    const { hostname } = window.location;
    return { tenantId: hostname.split(".")[0], domain: hostname };
  }, []);

  useEffect(() => {
    getCompanies().catch(console.error);
  }, [getCompanies]);

  const handleActivateFE = async () => {
    try {
      const tenant = await createTenant({ id: tenantId, domain });

      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: `Facturación electrónica activada para ${tenant.id}`,
        life: 4000,
      });

      await getCompanies();
    } catch (e: any) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: e?.message || "No se pudo activar la facturación electrónica",
        life: 5000,
      });
    }
  };

  if (companiesLoading && feStatus === "unknown") {
    return (
      <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <ProgressSpinner />
        <p>Verificando estado de facturación electrónica...</p>
      </div>
    );
  }

  if (companiesError) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <Toast ref={toast} />
        {!loading ? (
          <Button label="Activar facturación electrónica" onClick={handleActivateFE} className="p-button-success" />
        ) : (
          <>
            <ProgressSpinner />
            <p>
              {step === "creating" && "Creando tenant..."}
              {step === "migrating" && "Ejecutando migraciones..."}
              {step === "seeding" && "Ejecutando seeders..."}
            </p>
          </>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Facturación activada correctamente</p>}
      </div>
    );
  }

  /* ✅ Si el endpoint responde ok (aunque sea data vacía) → mostrar formulario */
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px", display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <Toast ref={toast} />
      <h2>Integración de Facturación Electrónica</h2>
      <FeConfigurationForm />
    </div>
  );
};
