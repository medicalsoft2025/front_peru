
import React, { useState, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import moment from 'moment';
import Swal from 'sweetalert2';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

// Services
// Assuming react/services exists as per AppointmentFormModal usage
import { appointmentService, inventoryService } from '../../../services/api';
import { rips, typeConsults, externalCauses, purposeConsultations } from '../../../services/commons';

// Components
import { AppointmentFormModal } from '../../appointments/AppointmentFormModal';

export const FullCalendarComponent = ({ specialtyId, doctorId }) => {
    const calendarRef = useRef(null);
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchEvents = React.useCallback(async (fetchInfo, successCallback, failureCallback) => {
        try {
            setLoading(true);
            const startDate = moment(fetchInfo.start).format('YYYY-MM-DD');
            const endDate = moment(fetchInfo.end).format('YYYY-MM-DD');

            // Using the same filter logic as in portada.php
            const response = await appointmentService.filterAppointments({
                per_page: 50, // Increased from 10 to ensure we get enough events
                page: 1,
                search: "",
                sort: "-appointment_date,appointment_time",
                appointmentDate: startDate + "," + endDate,
            });

            const appointments = response?.data?.data || [];

            const filteredAndMapped = appointments
                .filter(appointment => {
                    const isActive = appointment.is_active;
                    const doctorMatch = doctorId ? appointment.user_availability?.user_id == doctorId : true;
                    const specialtyMatch = specialtyId ? appointment.user_availability?.user?.user_specialty_id == specialtyId : true;
                    return isActive && doctorMatch && specialtyMatch;
                })
                .map((appointment) => {
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
                    // Calculate end time
                    const duration = user_availability.appointment_duration || 30; // Default to 30 if missing
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
                            // extra props for details
                            patient: patient,
                            attentionType: rips[attention_type],
                            consultationType: typeConsults[consultation_type],
                            externalCause: externalCauses[external_cause],
                            consultationPurpose: purposeConsultations[consultation_purpose]
                        }
                    };
                });

            successCallback(filteredAndMapped);
        } catch (error) {
            console.error(error);
            failureCallback(error);
        } finally {
            setLoading(false);
        }
    }, [specialtyId, doctorId]);

    const handleEventClick = async (info) => {
        const event = info.event;
        const props = event.extendedProps;
        const appointmentId = props.appointment.id;

        // Fetch inventory product similar to portada.php logic
        // "const product = await inventoryService.getById(info.event._def.extendedProps.appointment.id) || 'sin producto';"
        let product = "sin producto";
        try {
            const productData = await inventoryService.getById(appointmentId);
            if (productData) product = productData;
        } catch (e) { /* ignore */ }

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

    const handleSelect = (info) => {
        // Logic to open create modal
        // We can pass the selected date to the modal if possible, but AppointmentFormModal usage in SummaryCard doesn't show props for that.
        // We will just open it.
        setShowCreateModal(true);
    };

    const handleEventDrop = (info) => {
        const { event, revert } = info;
        const start = moment(event.start).format('YYYY-MM-DD HH:mm:ss');

        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Si Acepta, Se movera la cita a la fecha ' + start,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Logic to update appointment?
                // portada.php logic was empty: "if (result.isConfirmed) { } else { arg.revert(); }"
                // So it didn't actually save. I will leave it empty but commented as per "implementación de lo que hay en portada.php"
                // Ideally I should implement the update via service, but I'll stick to the existing behavior (visual only until refresh?)
                // Actually if it's empty, it stays moved in UI but not backend.
            } else {
                revert();
            }
        });
    };

    // Refetch when filters change
    useEffect(() => {
        if (calendarRef.current) {
            calendarRef.current.getApi().refetchEvents();
        }
    }, [specialtyId, doctorId]);

    const renderEventContent = (eventInfo) => {
        return (
            <div className="fc-content">
                <div className="fc-title">{eventInfo.event.title}</div>
            </div>
        );
    }

    return (
        <div className="full-calendar-wrapper">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale={esLocale}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                buttonText={{
                    today: 'Dia Actual',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Dia',
                }}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                events={fetchEvents}
                eventClick={handleEventClick}
                select={handleSelect}
                eventDrop={handleEventDrop}
                height="800px"
                contentHeight="780px"
                nowIndicator={true}
                navLinks={true}
                businessHours={true}
                eventContent={renderEventContent}
            />

            <Dialog
                header="Detalles de la Cita"
                visible={showDetailsModal}
                style={{ width: '50vw' }}
                onHide={() => setShowDetailsModal(false)}
            >
                {selectedEvent && (
                    <div className="grid">
                        <div className="col-12">
                            <h5 className="text-primary">{selectedEvent.title}</h5>
                            <p>{selectedEvent.description}</p>
                        </div>
                        <div className="col-12 md:col-6">
                            <p><strong>Inicio:</strong> {selectedEvent.start}</p>
                            <p><strong>Fin:</strong> {selectedEvent.end}</p>
                            <p><strong>Médico:</strong> {selectedEvent.doctor}</p>
                        </div>
                    </div>
                )}
                <div className="flex justify-content-end mt-4">
                    <Button label="Cerrar" icon="pi pi-times" onClick={() => setShowDetailsModal(false)} className="p-button-outlined" />
                </div>
            </Dialog>

            <AppointmentFormModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onAppointmentCreated={() => {
                    if (calendarRef.current) calendarRef.current.getApi().refetchEvents();
                }}
            />
        </div>
    );
};
