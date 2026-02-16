import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { aiService } from '../ai/services/AIService';

interface ClinicalRecordSummaryProps {
    clinicalRecordId: string | number | null;
    visible: boolean;
    onHide: () => void;
}

interface InterventionData {
    tratamiento_farmacologico: string[];
    estudios_solicitados: string[];
    incapacidades_otorgadas: string[];
    remisiones_realizadas: string[];
}

interface SummaryResponse {
    resumen_narrativo_consulta: string;
    diagnosticos_identificados: string[];
    hallazgos_clinicos_clave: string[];
    intervenciones_terapeuticas: InterventionData;
    seguimiento_y_evolucion: {
        notas_evolucion: string[];
        plan_seguimiento_inferido: string;
        profesional_a_cargo: string;
    };
    sintesis_final_consulta: string;
}

export const ClinicalRecordSummary: React.FC<ClinicalRecordSummaryProps> = ({
    clinicalRecordId,
    visible,
    onHide
}) => {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['clinicalRecordSummary', clinicalRecordId],
        queryFn: async () => {
            if (!clinicalRecordId) return null;
            const response = await aiService.clinicalRecordSummary({ clinicalRecordId: clinicalRecordId.toString() });

            // Handle response structure logic
            // Structure provided: { data: { response: { ...fields } } }
            if (response.data?.response?.resumen_narrativo_consulta) {
                return response.data.response as SummaryResponse;
            }
            // Fallback
            if (response.data?.resumen_narrativo_consulta) {
                return response.data as SummaryResponse;
            }
            // Or message based like patient summary
            if (response.message?.response?.resumen_narrativo_consulta) {
                return response.message.response as SummaryResponse;
            }

            throw new Error("Invalid response format");
        },
        enabled: !!clinicalRecordId && visible, // Only fetch when ID exists and dialog is open
        retry: false,
        staleTime: 1000 * 60 * 15,
    });

    const renderLoading = () => (
        <div className="p-4">
            <div className="mb-4">
                <Skeleton width="40%" height="1.5rem" className="mb-2" />
                <Skeleton width="100%" height="6rem" />
            </div>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <Skeleton width="50%" height="1.5rem" className="mb-2" />
                    <Skeleton width="100%" height="4rem" />
                </div>
                <div className="col-md-6 mb-4">
                    <Skeleton width="50%" height="1.5rem" className="mb-2" />
                    <Skeleton width="100%" height="4rem" />
                </div>
            </div>
        </div>
    );

    const renderError = () => (
        <div className="text-center py-5">
            <i className="fa-solid fa-triangle-exclamation text-danger fa-3x mb-3"></i>
            <h4 className="text-danger">Error al cargar resumen</h4>
            <p className="text-muted mb-4">No se pudo generar el resumen de esta historia clínica.</p>
            <Button
                label="Reintentar"
                icon="pi pi-refresh"
                className="p-button-danger p-button-outlined"
                onClick={() => refetch()}
            />
        </div>
    );

    const renderList = (items: string[], icon: string = "fa-check", emptyText: string = "Ninguno") => {
        if (!items || items.length === 0) return <p className="text-muted fst-italic mb-0">{emptyText}</p>;
        return (
            <ul className="list-group list-group-flush mb-0">
                {items.map((item, idx) => (
                    <li key={idx} className="list-group-item bg-transparent border-0 ps-0 py-1">
                        <i className={`fa-solid ${icon} text-primary me-2`}></i>
                        {item}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <Dialog
            header={
                <div className="d-flex align-items-center">
                    <i className="fa-solid fa-robot text-primary me-2"></i>
                    <span>Resumen IA de Historia Clínica</span>
                </div>
            }
            visible={visible}
            style={{ width: '90vw', maxWidth: '900px' }}
            onHide={onHide}
            maximizable
            modal
            className="p-fluid"
        >
            {isLoading ? renderLoading() : isError || !data ? renderError() : (
                <div className="container-fluid py-2">
                    {/* Resumen Narrativo */}
                    <div className="alert alert-light border shadow-sm mb-4">
                        <h5 className="fw-bold text-primary mb-2">
                            <i className="fa-solid fa-file-invoice me-2"></i>
                            Resumen Narrativo
                        </h5>
                        <p className="mb-0 text-dark lh-base" style={{ fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                            {data.resumen_narrativo_consulta}
                        </p>
                    </div>

                    <div className="row g-4">
                        {/* Diagnósticos */}
                        <div className="col-md-6">
                            <div className="h-100 p-3 border rounded shadow-sm bg-white">
                                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                                    <i className="fa-solid fa-stethoscope text-danger me-2"></i>
                                    Diagnósticos Identificados
                                </h6>
                                {renderList(data.diagnosticos_identificados)}
                            </div>
                        </div>

                        {/* Hallazgos */}
                        <div className="col-md-6">
                            <div className="h-100 p-3 border rounded shadow-sm bg-white">
                                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                                    <i className="fa-solid fa-magnifying-glass text-info me-2"></i>
                                    Hallazgos Clínicos Clave
                                </h6>
                                {renderList(data.hallazgos_clinicos_clave, "fa-notes-medical")}
                            </div>
                        </div>

                        {/* Intervenciones Terapéuticas */}
                        <div className="col-12">
                            <div className="p-3 border rounded shadow-sm bg-white">
                                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                                    <i className="fa-solid fa-hand-holding-medical text-success me-2"></i>
                                    Intervenciones Terapéuticas
                                </h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <strong className="d-block text-secondary mb-2">Tratamiento Farmacológico</strong>
                                        {renderList(data.intervenciones_terapeuticas?.tratamiento_farmacologico, "fa-pills")}
                                    </div>
                                    <div className="col-md-6">
                                        <strong className="d-block text-secondary mb-2">Estudios Solicitados</strong>
                                        {renderList(data.intervenciones_terapeuticas?.estudios_solicitados, "fa-microscope")}
                                    </div>
                                    <div className="col-md-6">
                                        <strong className="d-block text-secondary mb-2">Incapacidades Otorgadas</strong>
                                        {renderList(data.intervenciones_terapeuticas?.incapacidades_otorgadas, "fa-bed")}
                                    </div>
                                    <div className="col-md-6">
                                        <strong className="d-block text-secondary mb-2">Remisiones Realizadas</strong>
                                        {renderList(data.intervenciones_terapeuticas?.remisiones_realizadas, "fa-share-from-square")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Seguimiento */}
                        <div className="col-md-6">
                            <div className="h-100 p-3 border rounded shadow-sm bg-white">
                                <h6 className="fw-bold text-dark border-bottom pb-2 mb-3">
                                    <i className="fa-solid fa-list-check text-warning me-2"></i>
                                    Seguimiento
                                </h6>
                                {/* {renderList(data.seguimiento_y_evolucion?.notas_evolucion, "fa-circle-check")} */}

                                {data.seguimiento_y_evolucion?.plan_seguimiento_inferido && (
                                    <div>
                                        <strong className="d-block text-secondary mb-1">Plan Inferido:</strong>
                                        <p className="small text-muted mb-0">{data.seguimiento_y_evolucion.plan_seguimiento_inferido}</p>
                                    </div>
                                )}

                                {data.seguimiento_y_evolucion?.profesional_a_cargo && (
                                    <div className="mt-2 text-end">
                                        <small className="text-secondary fst-italic">
                                            <i className="fa-solid fa-user-md me-1"></i>
                                            {data.seguimiento_y_evolucion.profesional_a_cargo}
                                        </small>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Síntesis Final */}
                        <div className="col-md-6">
                            <div className="h-100 p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded d-flex flex-column justify-content-center">
                                <h6 className="fw-bold text-primary mb-3">
                                    <i className="fa-solid fa-star me-2"></i>
                                    Síntesis Final
                                </h6>
                                <p className="mb-0 text-dark small">
                                    {data.sintesis_final_consulta}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    );
};
