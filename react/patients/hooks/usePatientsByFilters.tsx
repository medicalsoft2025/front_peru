import { useQuery } from '@tanstack/react-query';
import { patientService } from '../../../services/api';
import { Patient } from '../../models/models';
import { cleanJsonObject } from '../../../services/utilidades';

interface PatientsFilters {
    search?: string;
    per_page?: number;
    page?: number;
    company_id?: number;
}

export const usePatientsByFilters = (filters: PatientsFilters) => {
    const { search = "", per_page = 10, page = 1, company_id } = filters;

    const {
        data,
        isLoading,
        isFetching,
        refetch,
        error
    } = useQuery({
        queryKey: ['patients', search, per_page, page, company_id],
        queryFn: async () => {
            const response = await patientService.getByFilters(cleanJsonObject({ search, per_page, page, company_id }));
            const patients: Patient[] = response.data.data.map((item: Patient) => ({
                ...item,
                label: `${item.first_name} ${item.middle_name} ${item.last_name} ${item.second_last_name}`,
            }));

            return {
                patients,
                totalRecords: response.data.total
            };
        },
        keepPreviousData: true, // Keep data while fetching new page
    });

    return {
        patients: data?.patients || [],
        totalRecords: data?.totalRecords || 0,
        loading: isLoading || isFetching,
        refetch,
        error
    };
};
