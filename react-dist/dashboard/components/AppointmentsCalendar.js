import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { FullCalendarWrapper } from "../../components/full-calendar/FullCalendarWrapper.js";
import { AppointmentFormModal } from "../../appointments/AppointmentFormModal.js";
import { appointmentService, inventoryService } from "../../../services/api/index.js";
import { rips, typeConsults, externalCauses, purposeConsultations } from "../../../services/commons.js";
export const AppointmentsCalendar = ({
  specialtyId,
  doctorId
}) => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState({
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().endOf('month').format('YYYY-MM-DD')
  });

  // UI State
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // React Query for fetching appointments
  const {
    data: events = [],
    isLoading
  } = useQuery({
    queryKey: ['calendar-appointments', dateRange, specialtyId, doctorId],
    queryFn: async () => {
      const response = await appointmentService.filterAppointments({
        per_page: 100,
        // Fetch up to 100 events for the view
        page: 1,
        search: "",
        sort: "-appointment_date,appointment_time",
        appointmentDate: dateRange.start + "," + dateRange.end
      });
      const appointments = response?.data?.data || [];
      return appointments.filter(appointment => {
        const isActive = appointment.is_active;
        // Doctor/Specialty filtering is also done here to be safe, though backend should ideally handle it if passed
        const doctorMatch = doctorId ? appointment.user_availability?.user_id == doctorId : true;
        // Note: Specialty check might be complex if not directly on appointment, usually on doctor. 
        // Based on legacy code: appointment.user_availability.user.user_specialty_id
        const specialtyMatch = specialtyId ? appointment.user_availability?.user?.user_specialty_id == specialtyId : true;
        return isActive && doctorMatch && specialtyMatch;
      }).map(appointment => {
        const {
          appointment_date,
          appointment_time,
          user_availability,
          patient,
          attention_type,
          consultation_purpose,
          consultation_type,
          external_cause
        } = appointment;
        const patientName = `${patient.first_name} ${patient.last_name}`;
        const startRaw = `${appointment_date}T${appointment_time}`;
        const duration = user_availability.appointment_duration || 30;
        const endRaw = moment(startRaw).add(duration, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
        const description = `Cita de ${patientName} el dia ${moment(appointment_date).format('D-MM-YYYY')} a las ${moment(appointment_time, 'HH:mm:ss').format('h:mm a')}`;
        return {
          id: appointment.id,
          title: patientName,
          start: startRaw,
          end: endRaw,
          description: description,
          extendedProps: {
            doctor_name: user_availability.user.first_name + " " + user_availability.user.last_name,
            appointment: appointment,
            patient: patient,
            attentionType: rips[attention_type],
            consultationType: typeConsults[consultation_type],
            externalCause: externalCauses[external_cause],
            consultationPurpose: purposeConsultations[consultation_purpose]
          }
        };
      });
    },
    keepPreviousData: true,
    // Keep data while fetching new range
    staleTime: 5 * 60 * 1000
  });
  const handleDateSet = dateInfo => {
    const start = moment(dateInfo.start).format('YYYY-MM-DD');
    const end = moment(dateInfo.end).format('YYYY-MM-DD');
    // Only update if changed significantly to avoid loops, though Query key handles it.
    // FullCalendar triggers this on view change / nav.
    if (start !== dateRange.start || end !== dateRange.end) {
      setDateRange({
        start,
        end
      });
    }
  };
  const handleEventClick = async info => {
    const event = info.event;
    const props = event.extendedProps;
    const appointmentId = props.appointment.id;
    let product = "sin producto";
    try {
      const productData = await inventoryService.getById(appointmentId);
      if (productData) product = productData;
    } catch (e) {/* ignore */}
    const productName = product?.name || "sin producto";
    setSelectedEvent({
      title: event.title,
      description: props.description + " para " + productName,
      start: moment(event.start).format('D-MM-YYYY, h:mm a'),
      end: moment(event.end).format('D-MM-YYYY, h:mm a'),
      doctor: props.doctor_name
    });
    setShowDetailsModal(true);
  };
  const handleSelect = () => {
    setShowCreateModal(true);
  };
  const handleEventDrop = info => {
    const {
      event,
      revert
    } = info;
    const start = moment(event.start).format('YYYY-MM-DD HH:mm:ss');
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Si Acepta, Se movera la cita a la fecha ' + start,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (!result.isConfirmed) {
        revert();
      }
      // Add update logic here if needed
    });
  };
  const renderEventContent = eventInfo => {
    return /*#__PURE__*/React.createElement("div", {
      className: "fc-event-content-custom",
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "fc-title",
      style: {
        fontWeight: 'bold'
      }
    }, eventInfo.event.title));
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(FullCalendarWrapper, {
    events: events,
    onDateSet: handleDateSet,
    onEventClick: handleEventClick,
    onSelect: handleSelect,
    onEventDrop: handleEventDrop,
    eventContent: renderEventContent
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: "Detalles de la Cita",
    visible: showDetailsModal,
    style: {
      width: '50vw'
    },
    onHide: () => setShowDetailsModal(false)
  }, selectedEvent && /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-primary"
  }, selectedEvent.title), /*#__PURE__*/React.createElement("p", null, selectedEvent.description)), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-6"
  }, /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Inicio:"), " ", selectedEvent.start), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "Fin:"), " ", selectedEvent.end), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "M\xE9dico:"), " ", selectedEvent.doctor))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-end mt-4"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cerrar",
    icon: "pi pi-times",
    onClick: () => setShowDetailsModal(false),
    className: "p-button-outlined"
  }))), /*#__PURE__*/React.createElement(AppointmentFormModal, {
    isOpen: showCreateModal,
    onClose: () => setShowCreateModal(false),
    onAppointmentCreated: () => {
      queryClient.invalidateQueries({
        queryKey: ['calendar-appointments']
      });
    }
  }));
};