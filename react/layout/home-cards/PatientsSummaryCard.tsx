import React from 'react';
import { usePatientsActiveCount } from './hooks/usePatientsActiveCount';

export const PatientsSummaryCard = () => {

    const { count, isFetching, isLoading } = usePatientsActiveCount();

    const handleViewPatients = () => {
        window.location.href = 'pacientescontrol';
    };

    return (
        <div className="card bg-secondary dashboard-card">
            <div className="card-body">
                <h5 className="card-title">
                    <i className="fa-solid fa-restroom ml-2"></i> Pacientes
                </h5>
                <div className="card-content">
                    {isFetching || isLoading ? (
                        <span className="text-span-descripcion">Cargando...</span>
                    ) : (
                        <>
                            <h3 id="patientsActiveCount">{count}</h3>
                            <span className="text-span-descripcion">Pacientes Creados</span>
                        </>
                    )}
                </div>
                <div className="card-button">
                    <button
                        className="btn btn-phoenix-secondary me-1 mb-1"
                        type="button"
                        onClick={handleViewPatients}
                    >
                        <i className="fa-solid fa-eye"></i> Ver Pacientes
                    </button>
                </div>
            </div>
        </div>
    );
};