import { useState } from "react";
import { useQuery } from '@tanstack/react-query';
import { appointmentService } from "../../../services/api/index.js";
const getEstado = appointment => {
  const stateId = appointment.appointment_state_id.toString();
  const stateKey = appointment.appointment_state?.name;
  const attentionType = appointment.attention_type || "CONSULTATION";
  const isPending = () => stateId === "1" || stateKey === "pending" && attentionType === "PROCEDURE";
  const isWaitingForConsultation = () => (stateId === "2" || stateKey === "pending_consultation" || stateKey === "in_consultation") && attentionType === "CONSULTATION";
  const isWaitingForExam = () => (stateId === "2" || stateKey === "pending_consultation") && attentionType === "PROCEDURE";
  const isConsultationCompleted = () => stateId === "8" || stateKey === "consultation_completed" && attentionType === "CONSULTATION";
  const isInConsultation = () => stateId === "7" || stateKey === "in_consultation" && attentionType === "CONSULTATION";

  // Usar switch-case para determinar el estado
  switch (true) {
    case isPending():
      return "Pendiente";
    case isWaitingForConsultation():
      return "En espera de consulta";
    case isWaitingForExam():
      return "En espera de examen";
    case isConsultationCompleted():
      return "Consulta Finalizada";
    case isInConsultation():
      return "En Consulta";
    default:
      return "Sin Cita";
  }
};
export const useFetchAppointments = (getCustomFilters, customMapper) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [companyId, setCompanyId] = useState(null);
  const [first, setFirst] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState(null);
  const defaultMapper = appointment => {
    const doctorFirstName = appointment.user_availability.user.first_name || "";
    const doctorMiddleName = appointment.user_availability.user.middle_name || "";
    const doctorLastName = appointment.user_availability.user.last_name || "";
    const doctorSecondLastName = appointment.user_availability.user.second_last_name || "";
    const doctorName = `${doctorFirstName} ${doctorMiddleName} ${doctorLastName} ${doctorSecondLastName}`;
    let attentionType = appointment.attention_type || "CONSULTATION";
    if (attentionType === "REHABILITATION") {
      attentionType = "CONSULTATION";
    }
    const estado = getEstado(appointment);
    return {
      patient: appointment.patient,
      id: appointment.id.toString(),
      patientName: `${appointment.patient.first_name || ''} ${appointment.patient.middle_name || ''} ${appointment.patient.last_name || ''} ${appointment.patient.second_last_name || ''}`,
      patientDNI: appointment.patient.document_number,
      patientId: appointment.patient_id.toString(),
      date: appointment.appointment_date,
      time: appointment.appointment_time,
      doctorName,
      entity: appointment.patient.social_security?.entity?.name || "--",
      status: appointment.is_active ? "Activo" : "Inactivo",
      branchId: appointment.user_availability.branch_id?.toString() || null,
      isChecked: false,
      stateId: appointment.appointment_state_id.toString(),
      stateKey: appointment.appointment_state?.name,
      attentionType: attentionType,
      productId: appointment.product_id,
      stateDescription: estado,
      user_availability: appointment?.user_availability,
      orders: appointment?.exam_orders,
      exam_recipe_id: appointment?.exam_recipe_id,
      patientEmail: appointment?.patient.email,
      patientPhone: appointment?.patient.whatsapp,
      companyName: appointment?.company?.legal_name || "--"
    };
  };
  const mapper = customMapper || defaultMapper;
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['appointments', search, perPage, currentPage, companyId],
    queryFn: async () => {
      try {
        const filters = typeof getCustomFilters === 'function' ? getCustomFilters() : {};
        const data = await appointmentService.filterAppointments({
          per_page: perPage,
          page: currentPage,
          search: search || "",
          ...filters,
          company_id: companyId
        });
        return {
          appointments: data.data.data.map(appointment => mapper(appointment)),
          totalRecords: data.data.total
        };
      } catch (error) {
        console.error(error);
      }
    },
    keepPreviousData: true // Keep data while fetching new page
  });
  const handlePageChange = page => {
    const calculatedPage = Math.floor(page.first / page.rows) + 1;
    setFirst(page.first);
    setPerPage(page.rows);
    setCurrentPage(calculatedPage);
  };
  const handleSearchChange = _search => {
    setSearch(_search);
  };
  const refresh = () => refetch();
  return {
    appointments: data?.appointments || [],
    handlePageChange,
    handleSearchChange,
    refresh,
    companyId,
    setCompanyId,
    totalRecords: data?.totalRecords || 0,
    first,
    perPage,
    currentPage,
    search,
    loading: isLoading || isFetching
  };
};