import { useState, useEffect, useRef } from 'react';
import { Company } from '../../company-configuration/types/consultorio';
import { companyService } from '../../../../services/api';
import { Toast } from 'primereact/toast';
import { SwalManager } from '../../../../services/alertManagerImported';

export const useCompaniesComponent = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(false);
    const toastRef = useRef<Toast>(null);

    const fetchCompanies = async () => {
        setLoading(true);
        try {
            const response = await companyService.getAllCompanies();
            if (response.status === 200 && response.data) {
                // Ensure data is array and map properly
                const data = Array.isArray(response.data) ? response.data : [];

                const mappedCompanies = data.map((item: any) => ({
                    id: item.id,
                    ...item.attributes
                }));

                setCompanies(mappedCompanies);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al cargar las empresas' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleDelete = async (company: Company) => {
        if (!company.id) return;

        await SwalManager.confirmDelete(async () => {
            setLoadingAction(true);
            try {
                // Ensure deleteCompany exists
                await companyService.deleteCompany(company.id);
                toastRef.current?.show({ severity: 'success', summary: 'Éxito', detail: 'Empresa eliminada correctamente' });
                fetchCompanies();
            } catch (error) {
                console.error('Error deleting company:', error);
                toastRef.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la empresa' });
            } finally {
                setLoadingAction(false);
            }
        });
    };

    const handleSave = async () => {
        fetchCompanies();
    };

    return {
        companies,
        loading,
        loadingAction,
        refetch: fetchCompanies,
        handleDelete,
        handleSave,
        toastRef
    };
};
