import { useState, useEffect } from 'react';
import { patientService } from '../../../services/api/index';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const usePatient = (patientId?: string) => {

    const queryClient = useQueryClient();

    const { data, refetch } = useQuery({
        queryKey: ['patient', patientId?.toString()],
        queryFn: () => patientService.get(patientId),
        enabled: !!patientId,
    });

    const refetchPatientById = (patientId: string) => {
        return queryClient.invalidateQueries({
            queryKey: ['patient', patientId.toString()]
        });
    };

    return { patient: data, fetchPatient: refetch, refetchPatientById };
};
