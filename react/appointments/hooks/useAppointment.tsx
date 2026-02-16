import { useState, useEffect } from 'react';
import { appointmentService, patientService } from '../../../services/api/index';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useAppointment = (appointmentId?: string) => {

    const queryClient = useQueryClient();

    const { data, refetch } = useQuery({
        queryKey: ['appointment', appointmentId?.toString()],
        queryFn: () => appointmentService.get(appointmentId),
        enabled: !!appointmentId,
    });

    const refetchAppointmentById = (appointmentId: string) => {
        return queryClient.invalidateQueries({
            queryKey: ['appointment', appointmentId.toString()]
        });
    };

    return { appointment: data, fetchAppointment: refetch, refetchAppointmentById };
};
