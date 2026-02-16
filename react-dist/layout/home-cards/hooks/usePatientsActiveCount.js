import { useQuery } from "@tanstack/react-query";
import { patientService } from "../../../../services/api/index.js";
export const usePatientsActiveCount = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ['patients-active-count'],
    queryFn: () => fetchPatientsActiveCount()
  });
  const fetchPatientsActiveCount = async () => {
    return await patientService.activeCount();
  };
  return {
    count: data,
    isLoading,
    isFetching,
    error,
    refetch
  };
};