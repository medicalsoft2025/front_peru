import { useState, useEffect, useRef } from 'react';
import { companyService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
export const useCompaniesCrud = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const toast = useRef(null);
  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await companyService.getAllCompanies();
      if (response.status === 200 && response.data) {
        const mappedCompanies = response.data.map(item => {
          // Handle both raw data and data with 'attributes' wrapper if present, 
          // though companyService.getAllCompanies() usually returns models.
          // Based on useCompanyGeneral, it seems data might be wrapped or not depending on endpoint.
          // The service returns `response` directly.
          // useCompanyGeneral does: const companyData = response.data[0].attributes;
          // But models usually don't have 'attributes' wrapping in this project unless it's a specific API resource.
          // useCompanyGeneral seems to expect a specific structure.
          // Let's assume standard Laravel resource response or direct array.
          // If it's standard array of models:
          const data = item.attributes || item;
          return {
            id: item.id,
            legal_name: data.legal_name,
            document_type: data.document_type,
            document_number: data.document_number,
            logo: data.logo,
            phone: data.phone,
            email: data.email,
            address: data.address,
            country: data.country,
            city: data.city,
            // Add other fields as necessary
            ...data
          };
        });
        setCompanies(mappedCompanies);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al cargar empresas'
      });
    } finally {
      setIsLoading(false);
    }
  };
  const deleteCompany = async company => {
    try {
      await SwalManager.confirmDelete(async () => {
        setIsLoading(true);
        await companyService.deleteCompany(company.id);
        await fetchCompanies();
        SwalManager.success('Empresa eliminada correctamente');
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Error al eliminar empresa'
      });
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCompanies();
  }, []);
  return {
    companies,
    isLoading,
    selectedCompany,
    setSelectedCompany,
    fetchCompanies,
    deleteCompany,
    toast
  };
};