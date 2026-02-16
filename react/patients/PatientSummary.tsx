import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { aiService } from '../ai/services/AIService';

interface PatientSummaryProps {
    patientId: string;
}

interface SummaryResponse {
    resumen_general: string;
    diagnosticos: string[];
    antecedentes_relevantes: string[];
    medicamentos: string[];
    tratamiento_actual: string;
    plan_de_seguimiento: string;
}

export const PatientSummary: React.FC<PatientSummaryProps> = ({ patientId }) => {
    const { data, isLoading, isFetching, isError, refetch } = useQuery({
        queryKey: ['patientSummary', patientId],
        queryFn: async () => {
            if (!patientId) throw new Error("Patient ID is required");
            const response = await aiService.patientSummary({ patientId });
            // The API structure is likely { data: [], message: { response: { ...summaryFields } } }
            // or { data: SummaryResponse, ... } depending on the standard response
            // Based on previous interaction, let's look for the nested structure in message.response

            if (response.message?.response?.resumen_general) {
                return response.message.response as SummaryResponse;
            }
            // Fallback if structure is simpler
            if (response.data?.resumen_general) {
                return response.data as SummaryResponse;
            }

            throw new Error("Invalid response format");
        },
        retry: false, // Don't retry automatically to show error UI and allow manual retry
        staleTime: 1000 * 60 * 15, // Cache for 15 minutes
    });

    if (isLoading || isFetching) {
        return (
            <div className="card shadow-sm p-4 mb-4">
                <div className="d-flex align-items-center mb-4">
                    <Skeleton shape="circle" size="3rem" className="mr-2" />
                    <Skeleton width="10rem" height="1.5rem" />
                </div>
                <div className="mb-4">
                    <Skeleton width="40%" height="1.2rem" className="mb-2" />
                    <Skeleton width="100%" height="4rem" />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-4">
                        <Skeleton width="30%" height="1.2rem" className="mb-2" />
                        <Skeleton width="100%" height="2rem" className="mb-2" />
                        <Skeleton width="100%" height="2rem" />
                    </div>
                    <div className="col-md-6 mb-4">
                        <Skeleton width="30%" height="1.2rem" className="mb-2" />
                        <Skeleton width="100%" height="2rem" className="mb-2" />
                        <Skeleton width="100%" height="2rem" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <Card className="shadow-sm mb-4 border-danger">
                <div className="text-center py-4">
                    <i className="fa-solid fa-triangle-exclamation text-danger fa-2x mb-3"></i>
                    <h4 className="text-danger mb-2">Error al generar el resumen</h4>
                    <p className="text-muted mb-4">
                        No se pudo generar el resumen asistido por IA. Por favor intenta nuevamente.
                    </p>
                    <Button
                        label="Reintentar Generación"
                        icon="pi pi-refresh"
                        className="p-button-danger p-button-outlined"
                        onClick={() => refetch()}
                    />
                </div>
            </Card>
        );
    }

    if (!data) return;

    const renderList = (items: string[]) => {
        if (!items || items.length === 0) {
            return <p className="text-muted fst-italic">No hay registros disponibles.</p>;
        }
        return (
            <ul className="list-group list-group-flush">
                {items.map((item, idx) => (
                    <li key={idx} className="list-group-item bg-transparent border-0 ps-0 py-1">
                        <i className="fa-solid fa-check text-primary me-2 flex-shrink-0"></i>
                        {item}
                    </li>
                ))}
            </ul>
        );
    };

    return (<>
        <Card className="shadow-sm mb-4 border-0">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div className="d-flex align-items-center">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                        <i className="fa-solid fa-user-doctor text-primary fa-xl"></i>
                    </div>
                    <div>
                        <h3 className="h4 mb-0 fw-bold">Resumen Clínico del Paciente</h3>
                        <small className="text-muted d-flex align-items-center mt-1">
                            <i className="fa-solid fa-robot me-1"></i>
                            Generado por IA • {new Date().toLocaleDateString()}
                        </small>
                    </div>
                </div>
                <Button
                    label="Refrescar"
                    icon={<i className="fa-solid fa-sync me-1"></i>}
                    size="small"
                    onClick={() => refetch()}
                />
            </div>

            <div className="row g-4">
                {/* Resumen General */}
                <div className="col-12">
                    <div className="bg-light p-4 rounded-3">
                        <h5 className="fw-bold text-primary mb-3">
                            <i className="fa-solid fa-file-medical-alt me-2"></i>
                            Resumen General
                        </h5>
                        <p className="mb-0 text-dark lh-lg" style={{ fontSize: '1.05rem' }}>
                            {data.resumen_general || "No hay información suficiente para generar un resumen."}
                        </p>
                    </div>
                </div>

                {/* Diagnósticos */}
                <div className="col-md-6">
                    <div className="h-100 p-3 border rounded-3">
                        <h5 className="fw-bold text-dark mb-3">
                            <i className="fa-solid fa-stethoscope text-danger me-2"></i>
                            Diagnósticos
                        </h5>
                        {renderList(data.diagnosticos)}
                    </div>
                </div>

                {/* Antecedentes */}
                <div className="col-md-6">
                    <div className="h-100 p-3 border rounded-3">
                        <h5 className="fw-bold text-dark mb-3">
                            <i className="fa-solid fa-history text-info me-2"></i>
                            Antecedentes Relevantes
                        </h5>
                        {renderList(data.antecedentes_relevantes)}
                    </div>
                </div>

                {/* Medicamentos */}
                <div className="col-md-6">
                    <div className="h-100 p-3 border rounded-3">
                        <h5 className="fw-bold text-dark mb-3">
                            <i className="fa-solid fa-pills text-success me-2"></i>
                            Medicamentos
                        </h5>
                        {renderList(data.medicamentos)}
                    </div>
                </div>

                {/* Tratamiento y Seguimiento */}
                <div className="col-md-6">
                    <div className="h-100 d-flex flex-column gap-3">
                        <div className="p-3 border rounded-3 flex-grow-1">
                            <h5 className="fw-bold text-dark mb-3">
                                <i className="fa-solid fa-hand-holding-medical text-warning me-2"></i>
                                Tratamiento Actual
                            </h5>
                            <p className="mb-0 text-muted">
                                {data.tratamiento_actual || "No especificado."}
                            </p>
                        </div>
                        <div className="p-3 border rounded-3 flex-grow-1 bg-primary bg-opacity-10 border-primary border-opacity-25">
                            <h5 className="fw-bold text-primary mb-3">
                                <i className="fa-solid fa-calendar-check me-2"></i>
                                Plan de Seguimiento
                            </h5>
                            <p className="mb-0 text-dark">
                                {data.plan_de_seguimiento || "No especificado."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-4 pt-3 border-top text-center text-muted small">
                <p className="mb-0">
                    <i className="fa-solid fa-circle-info me-2"></i>
                    Este reporte ha sido generado automáticamente por inteligencia artificial. Por favor verifique la información con los registros clínicos oficiales.
                </p>
            </div>
        </Card>
    </>);
};
