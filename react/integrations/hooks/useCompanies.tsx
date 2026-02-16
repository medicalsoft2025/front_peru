import { useState, useCallback } from "react";
import { feCompaniesService } from "../../../services/api";

export const useCompanies = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [feStatus, setFeStatus] = useState<"unknown" | "inactive" | "active">("unknown");

  /* Obtener compañías */
  const getCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await feCompaniesService.getCompanies();

      setFeStatus("active");
      setCompanies(response.data ?? []);
      return response.data ?? [];

    } catch (err: any) {
      console.error("companies error:", err);

      const message = err?.response?.data?.message ?? err?.message ?? "";

      if (
        message.includes("Tenant could not be identified") ||
        message.includes("Base table or view not found")
      ) {
        setFeStatus("inactive");
        setCompanies([]);
        return [];
      }

      setError(err);
      throw err;

    } finally {
      setLoading(false);
    }
  }, []);

  /* Crear nueva compañía */
  const createCompany = useCallback(async (companyData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feCompaniesService.createCompany(companyData);
      await getCompanies(); // refresca lista
      return response.data ?? response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCompanies]);

  /* Actualizar compañía existente */
  const updateCompany = useCallback(async (companyId: string, companyData: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feCompaniesService.updateCompany(companyId, companyData);
      await getCompanies(); // refresca lista
      return response.data ?? response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCompanies]);

  /* Eliminar compañía */
  const deleteCompany = useCallback(async (companyId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feCompaniesService.deleteCompany(companyId);
      await getCompanies(); // refresca lista
      return response.data ?? response;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCompanies]);

  /* Refrescar manualmente */
  const refresh = useCallback(() => getCompanies(), [getCompanies]);

  return {
    companies,
    loading,
    error,
    feStatus,
    getCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    refresh,
  };
};
