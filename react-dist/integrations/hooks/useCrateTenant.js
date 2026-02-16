import { useState } from "react";
import { createTenantService } from "../../../services/api/index.js";
export const useCreateTenant = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const createTenant = useCallback(async data => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const tenantResponse = await createTenantService.createTenant(data);
      const tenantInfo = tenantResponse.data;
      await createTenantService.createMigrations({
        tenantId: tenantInfo.id
      });
      await createTenantService.runSeeders({
        tenantId: tenantInfo.id
      });
      setSuccess(true);
      return tenantInfo;
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Error al crear el tenant");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  return {
    createTenant,
    loading,
    error,
    success
  };
};
function useCallback(arg0, arg1) {
  throw new Error("Function not implemented.");
}