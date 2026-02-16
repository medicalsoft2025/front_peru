import { useState } from 'react';
import { appointmentService } from "../../../services/api/index.js";
import { useAppointmentsActiveCount } from "../../layout/home-cards/hooks/useAppointmentsActiveCount.js";
export const useAppointmentBulkCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    refetch: refetchAppointmentsActiveCount
  } = useAppointmentsActiveCount();
  const createAppointmentBulk = async (appointments, patientId) => {
    setLoading(true);
    try {
      await appointmentService.bulkCreate(appointments, patientId);
      refetchAppointmentsActiveCount();
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    loading,
    createAppointmentBulk
  };
};