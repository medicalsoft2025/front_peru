import { useState } from 'react'
import { appointmentService } from '../../../services/api'
import { useAppointmentsActiveCount } from '../../layout/home-cards/hooks/useAppointmentsActiveCount'

export const useAppointmentBulkCreate = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const { refetch: refetchAppointmentsActiveCount } = useAppointmentsActiveCount()

    const createAppointmentBulk = async (appointments: Omit<any, 'id'>, patientId: string) => {
        setLoading(true)
        try {
            await appointmentService.bulkCreate(appointments, patientId)
            refetchAppointmentsActiveCount()
        } catch (error) {
            console.log(error);
            throw error
        } finally {
            setLoading(false)
        }
    }

    return { loading, createAppointmentBulk }
}
