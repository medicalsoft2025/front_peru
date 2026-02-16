import { useState, useCallback } from "react";
import { feCompaniesService } from "../../../services/api/index.js";
export const useCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feStatus, setFeStatus] = useState("unknown");

  /* Obtener compañías */
  const getCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await feCompaniesService.getCompanies();
      setFeStatus("active");
      setCompanies(response.data ?? []);
      return response.data ?? [];
    } catch (err) {
      console.error("companies error:", err);
      const message = err?.response?.data?.message ?? err?.message ?? "";
      if (message.includes("Tenant could not be identified") || message.includes("Base table or view not found")) {
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
  const createCompany = useCallback(async companyData => {
    setLoading(true);
    setError(null);
    try {
      const response = await feCompaniesService.createCompany(companyData);
      await getCompanies(); // refresca lista
      return response.data ?? response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCompanies]);

  /* Actualizar compañía existente */
  const updateCompany = useCallback(async (companyId, companyData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await feCompaniesService.updateCompany(companyId, companyData);
      await getCompanies(); // refresca lista
      return response.data ?? response;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getCompanies]);

  /* Eliminar compañía */
  const deleteCompany = useCallback(async companyId => {
    setLoading(true);
    setError(null);
    try {
      const response = await feCompaniesService.deleteCompany(companyId);
      await getCompanies(); // refresca lista
      return response.data ?? response;
    } catch (err) {
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
    refresh
  };
};