import { useState, useCallback } from "react";
import { createTenantService } from "../../../services/api/index.js";
export const useCreateTenant = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("idle");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const createTenant = useCallback(async data => {
    setLoading(true);
    setStep("creating");
    setError(null);
    setSuccess(false);
    try {
      // 1️⃣ Crear tenant
      const tenantResponse = await createTenantService.createTenant(data);
      if (!tenantResponse?.tenant) {
        throw new Error("Respuesta inválida del backend");
      }
      const tenantInfo = tenantResponse.tenant;

      // 2️⃣ Migraciones
      setStep("migrating");
      await createTenantService.createMigrations();

      // 3️⃣ Seeders
      setStep("seeding");
      await createTenantService.runSeeders();
      setStep("success");
      setSuccess(true);
      return tenantInfo;
    } catch (err) {
      console.error(err);
      setStep("error");
      setError(err.message ?? "Error al activar facturación electrónica");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    createTenant,
    loading,
    step,
    error,
    success
  };
};