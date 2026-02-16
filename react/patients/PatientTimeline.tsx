import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { patientService } from '../../services/api';
import { ClinicalRecordSummary } from './ClinicalRecordSummary';

interface PatientTimelineProps {
    patientId: string;
}

interface TimelineEvent {
    id?: number | string; // Assuming ID exists based on requirement to fetch details
    related_id?: number | string; // Alternative ID field
    created_at: string;
    title: string;
    content: string;
    type: 'clinical_record' | 'disability' | 'evolution_note' | string;
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ patientId }) => {
    const [selectedRecordId, setSelectedRecordId] = useState<string | number | null>(null);
    const [showSummaryDialog, setShowSummaryDialog] = useState(false);

    const { data: events, isLoading, isError, refetch } = useQuery({
        queryKey: ['patientEvolution', patientId],
        queryFn: async () => {
            if (!patientId) throw new Error("Patient ID is required");
            const response = await patientService.evolution(patientId);
            // API returns array directly or inside data?
            // User example shows array: [ { ... }, ... ]
            // BaseApiService usually returns { data: ... } or the response directly depending on config.
            // Let's assume response.data or response is the array.
            const list = Array.isArray(response) ? response : (response.data || []);
            return list as TimelineEvent[];
        },
        retry: 1,
        staleTime: 1000 * 60 * 5,
    });

    const openSummary = (id: string | number) => {
        setSelectedRecordId(id);
        setShowSummaryDialog(true);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'clinical_record':
                return 'fa-user-doctor';
            case 'disability':
                return 'fa-bed-pulse';
            case 'evolution_note':
                return 'fa-notes-medical';
            case 'nursing_note':
                return 'fa-user-nurse';
            default:
                return 'fa-file-medical';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'clinical_record':
                return '#0d6efd'; // primary
            case 'disability':
                return '#dc3545'; // danger
            case 'evolution_note':
                return '#198754'; // success
            case 'nursing_note':
                return '#0dcaf0'; // info
            default:
                return '#6c757d'; // secondary
        }
    };

    const customizedMarker = (item: TimelineEvent) => {
        return (
            <span
                className="d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                style={{
                    backgroundColor: getColor(item.type),
                    width: '32px',
                    height: '32px',
                    minWidth: '32px'
                }}
            >
                <i className={`fa-solid ${getIcon(item.type)} text-white`} style={{ fontSize: '14px' }}></i>
            </span>
        );
    };

    const customizedContent = (item: TimelineEvent) => {
        const date = new Date(item.created_at).toLocaleDateString();
        const time = new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Use ID if available, otherwise try to extract or warn
        // If type is clinical_record, we show the button. 
        // If no ID is present, we might fail to fetch, but the button should be visible to debug.
        const recordId = item.id || item.related_id;
        const showAiButton = item.type === 'clinical_record';

        return (
            <Card className="mb-3 shadow-sm border-0 bg-light">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="fw-bold mb-0" style={{ color: getColor(item.type) }}>
                        {item.title}
                    </h6>
                    <small className="text-muted ms-2 text-nowrap">
                        {date} {time}
                    </small>
                </div>

                <p className="text-secondary mb-2 small" style={{ whiteSpace: 'pre-line' }}>
                    {item.content}
                </p>

                {showAiButton && (
                    <div className="mt-2">
                        <Button
                            label="Ver Resumen IA"
                            icon={<i className="fa-solid fa-wand-magic-sparkles"></i>}
                            onClick={() => {
                                if (recordId) {
                                    openSummary(recordId);
                                } else {
                                    console.warn("No ID found for this record:", item);
                                    // Fallback for demo/testing if strictly needed, or alert user
                                    alert("No se pudo obtener el ID de la historia clínica para generar el resumen.");
                                }
                            }}
                        />
                    </div>
                )}
            </Card>
        );
    };

    // ... (Loading and Error states remain similar, just wrapped if needed) ...
    // Note: I am replacing the return block mostly.

    if (isLoading) {
        return (
            <div className="p-3">
                {/* Skeleton simplified */}
                <Skeleton width="100%" height="4rem" className="mb-3" />
                <Skeleton width="100%" height="4rem" className="mb-3" />
                <Skeleton width="100%" height="4rem" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="alert alert-danger m-3">
                Error al cargar evolución <Button label="Reintentar" link onClick={() => refetch()} className="p-0 ms-1 align-baseline" />
            </div>
        );
    }

    return (
        <div className="patient-timeline-container" style={{ maxHeight: '600px', overflowY: 'auto', padding: '1rem' }}>
            {(!events || events.length === 0) ? (
                <div className="text-center py-5 text-muted">
                    <p>No hay eventos registrados.</p>
                </div>
            ) : (<>
                <Timeline
                    value={events}
                    align="left"
                    className="customized-timeline w-100" // w-100 to take full width
                    marker={customizedMarker}
                    content={customizedContent}
                    opposite={(item) => <></>} // Hide opposite side content to fix "centered" look
                />
            </>)}

            <ClinicalRecordSummary
                clinicalRecordId={selectedRecordId}
                visible={showSummaryDialog}
                onHide={() => setShowSummaryDialog(false)}
            />

            <style>{`
                .customized-timeline .p-timeline-event-opposite {
                    display: none !important;
                    flex: 0;
                    padding: 0;
                }
                .customized-timeline .p-timeline-event-content {
                    padding-bottom: 2rem;
                }
            `}</style>
        </div>
    );
};
