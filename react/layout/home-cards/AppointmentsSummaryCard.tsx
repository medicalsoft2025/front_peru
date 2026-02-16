import React from 'react';
import { AppointmentFormModal } from '../../appointments/AppointmentFormModal';
import { useAppointmentsActiveCount } from './hooks/useAppointmentsActiveCount';

export const AppointmentsSummaryCard = () => {
    const [showAppointmentFormModal, setShowAppointmentFormModal] = React.useState(false);

    const { count, isFetching } = useAppointmentsActiveCount();

    return (
        <div className="card dashboard-card">
            <div className="card-body">
                <h5 className="card-title">
                    <i className='far fa-calendar-check ml-2'></i> Citas Generadas
                </h5>
                <div className="card-content">
                    {isFetching ? (
                        <span className="text-span-descripcion">Cargando...</span>
                    ) : (
                        <>
                            <h3 id="appointmentsActiveCount">{count}</h3>
                            <span className="text-span-descripcion">Citas este mes</span>
                        </>
                    )}
                </div>
                <div className="card-button">
                    <button
                        className="btn btn-phoenix-secondary me-1 mb-1"
                        type="button"
                        onClick={() => setShowAppointmentFormModal(true)}
                    >
                        <span className="far fa-calendar-plus"></span> Nueva Cita
                    </button>
                </div>
                <AppointmentFormModal
                    isOpen={showAppointmentFormModal}
                    onClose={() => setShowAppointmentFormModal(false)}
                />
            </div>
        </div>
    );
};