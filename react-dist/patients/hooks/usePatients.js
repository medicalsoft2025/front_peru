import { useQuery } from '@tanstack/react-query';
import { patientService } from "../../../services/api/index.js";
export const usePatients = () => {
  const {
    data: patients = [],
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['patients-active'],
    queryFn: async () => {
      const data = await patientService.active();
      return data.map(item => ({
        ...item,
        label: `${item.first_name} ${item.middle_name} ${item.last_name} ${item.second_last_name}`
      }));
    }
  });
  return {
    patients,
    fetchPatients: refetch,
    loading: isLoading || isFetching
  };
};