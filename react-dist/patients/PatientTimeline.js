import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { patientService } from "../../services/api/index.js";
import { ClinicalRecordSummary } from "./ClinicalRecordSummary.js";
export const PatientTimeline = ({
  patientId
}) => {
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);
  const {
    data: events,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['patientEvolution', patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      const response = await patientService.evolution(patientId);
      // API returns array directly or inside data?
      // User example shows array: [ { ... }, ... ]
      // BaseApiService usually returns { data: ... } or the response directly depending on config.
      // Let's assume response.data or response is the array.
      const list = Array.isArray(response) ? response : response.data || [];
      return list;
    },
    retry: 1,
    staleTime: 1000 * 60 * 5
  });
  const openSummary = id => {
    setSelectedRecordId(id);
    setShowSummaryDialog(true);
  };
  const getIcon = type => {
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
  const getColor = type => {
    switch (type) {
      case 'clinical_record':
        return '#0d6efd';
      // primary
      case 'disability':
        return '#dc3545';
      // danger
      case 'evolution_note':
        return '#198754';
      // success
      case 'nursing_note':
        return '#0dcaf0';
      // info
      default:
        return '#6c757d';
      // secondary
    }
  };
  const customizedMarker = item => {
    return /*#__PURE__*/React.createElement("span", {
      className: "d-flex align-items-center justify-content-center rounded-circle shadow-sm",
      style: {
        backgroundColor: getColor(item.type),
        width: '32px',
        height: '32px',
        minWidth: '32px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${getIcon(item.type)} text-white`,
      style: {
        fontSize: '14px'
      }
    }));
  };
  const customizedContent = item => {
    const date = new Date(item.created_at).toLocaleDateString();
    const time = new Date(item.created_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    // Use ID if available, otherwise try to extract or warn
    // If type is clinical_record, we show the button. 
    // If no ID is present, we might fail to fetch, but the button should be visible to debug.
    const recordId = item.id || item.related_id;
    const showAiButton = item.type === 'clinical_record';
    return /*#__PURE__*/React.createElement(Card, {
      className: "mb-3 shadow-sm border-0 bg-light"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center mb-2"
    }, /*#__PURE__*/React.createElement("h6", {
      className: "fw-bold mb-0",
      style: {
        color: getColor(item.type)
      }
    }, item.title), /*#__PURE__*/React.createElement("small", {
      className: "text-muted ms-2 text-nowrap"
    }, date, " ", time)), /*#__PURE__*/React.createElement("p", {
      className: "text-secondary mb-2 small",
      style: {
        whiteSpace: 'pre-line'
      }
    }, item.content), showAiButton && /*#__PURE__*/React.createElement("div", {
      className: "mt-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Ver Resumen IA",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-wand-magic-sparkles"
      }),
      onClick: () => {
        if (recordId) {
          openSummary(recordId);
        } else {
          console.warn("No ID found for this record:", item);
          // Fallback for demo/testing if strictly needed, or alert user
          alert("No se pudo obtener el ID de la historia clínica para generar el resumen.");
        }
      }
    })));
  };

  // ... (Loading and Error states remain similar, just wrapped if needed) ...
  // Note: I am replacing the return block mostly.

  if (isLoading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "4rem",
      className: "mb-3"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "4rem",
      className: "mb-3"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "4rem"
    }));
  }
  if (isError) {
    return /*#__PURE__*/React.createElement("div", {
      className: "alert alert-danger m-3"
    }, "Error al cargar evoluci\xF3n ", /*#__PURE__*/React.createElement(Button, {
      label: "Reintentar",
      link: true,
      onClick: () => refetch(),
      className: "p-0 ms-1 align-baseline"
    }));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "patient-timeline-container",
    style: {
      maxHeight: '600px',
      overflowY: 'auto',
      padding: '1rem'
    }
  }, !events || events.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-5 text-muted"
  }, /*#__PURE__*/React.createElement("p", null, "No hay eventos registrados.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Timeline, {
    value: events,
    align: "left",
    className: "customized-timeline w-100" // w-100 to take full width
    ,
    marker: customizedMarker,
    content: customizedContent,
    opposite: item => /*#__PURE__*/React.createElement(React.Fragment, null) // Hide opposite side content to fix "centered" look
  })), /*#__PURE__*/React.createElement(ClinicalRecordSummary, {
    clinicalRecordId: selectedRecordId,
    visible: showSummaryDialog,
    onHide: () => setShowSummaryDialog(false)
  }), /*#__PURE__*/React.createElement("style", null, `
                .customized-timeline .p-timeline-event-opposite {
                    display: none !important;
                    flex: 0;
                    padding: 0;
                }
                .customized-timeline .p-timeline-event-content {
                    padding-bottom: 2rem;
                }
            `));
};