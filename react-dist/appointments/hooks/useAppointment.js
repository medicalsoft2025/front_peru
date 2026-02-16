import { appointmentService } from "../../../services/api/index.js";
import { useQuery, useQueryClient } from '@tanstack/react-query';
export const useAppointment = appointmentId => {
  const queryClient = useQueryClient();
  const {
    data,
    refetch
  } = useQuery({
    queryKey: ['appointment', appointmentId?.toString()],
    queryFn: () => appointmentService.get(appointmentId),
    enabled: !!appointmentId
  });
  const refetchAppointmentById = appointmentId => {
    return queryClient.invalidateQueries({
      queryKey: ['appointment', appointmentId.toString()]
    });
  };
  return {
    appointment: data,
    fetchAppointment: refetch,
    refetchAppointmentById
  };
};