import { useQuery } from "@tanstack/react-query";
import { appointmentService } from "../../../../services/api/index.js";
export const useAppointmentsActiveCount = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ['appointments-active-count'],
    queryFn: () => fetchAppointmentsActiveCount()
  });
  const fetchAppointmentsActiveCount = async () => {
    return await appointmentService.activeCount();
  };
  return {
    count: data,
    isLoading,
    isFetching,
    error,
    refetch
  };
};