import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { aiService } from "../ai/services/AIService.js";
export const PatientSummary = ({
  patientId
}) => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ['patientSummary', patientId],
    queryFn: async () => {
      if (!patientId) throw new Error("Patient ID is required");
      const response = await aiService.patientSummary({
        patientId
      });
      // The API structure is likely { data: [], message: { response: { ...summaryFields } } }
      // or { data: SummaryResponse, ... } depending on the standard response
      // Based on previous interaction, let's look for the nested structure in message.response

      if (response.message?.response?.resumen_general) {
        return response.message.response;
      }
      // Fallback if structure is simpler
      if (response.data?.resumen_general) {
        return response.data;
      }
      throw new Error("Invalid response format");
    },
    retry: false,
    // Don't retry automatically to show error UI and allow manual retry
    staleTime: 1000 * 60 * 15 // Cache for 15 minutes
  });
  if (isLoading || isFetching) {
    return /*#__PURE__*/React.createElement("div", {
      className: "card shadow-sm p-4 mb-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center mb-4"
    }, /*#__PURE__*/React.createElement(Skeleton, {
      shape: "circle",
      size: "3rem",
      className: "mr-2"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "10rem",
      height: "1.5rem"
    })), /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement(Skeleton, {
      width: "40%",
      height: "1.2rem",
      className: "mb-2"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "4rem"
    })), /*#__PURE__*/React.createElement("div", {
      className: "row"
    }, /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 mb-4"
    }, /*#__PURE__*/React.createElement(Skeleton, {
      width: "30%",
      height: "1.2rem",
      className: "mb-2"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "2rem",
      className: "mb-2"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "2rem"
    })), /*#__PURE__*/React.createElement("div", {
      className: "col-md-6 mb-4"
    }, /*#__PURE__*/React.createElement(Skeleton, {
      width: "30%",
      height: "1.2rem",
      className: "mb-2"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "2rem",
      className: "mb-2"
    }), /*#__PURE__*/React.createElement(Skeleton, {
      width: "100%",
      height: "2rem"
    }))));
  }
  if (isError) {
    return /*#__PURE__*/React.createElement(Card, {
      className: "shadow-sm mb-4 border-danger"
    }, /*#__PURE__*/React.createElement("div", {
      className: "text-center py-4"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-triangle-exclamation text-danger fa-2x mb-3"
    }), /*#__PURE__*/React.createElement("h4", {
      className: "text-danger mb-2"
    }, "Error al generar el resumen"), /*#__PURE__*/React.createElement("p", {
      className: "text-muted mb-4"
    }, "No se pudo generar el resumen asistido por IA. Por favor intenta nuevamente."), /*#__PURE__*/React.createElement(Button, {
      label: "Reintentar Generaci\xF3n",
      icon: "pi pi-refresh",
      className: "p-button-danger p-button-outlined",
      onClick: () => refetch()
    })));
  }
  if (!data) return;
  const renderList = items => {
    if (!items || items.length === 0) {
      return /*#__PURE__*/React.createElement("p", {
        className: "text-muted fst-italic"
      }, "No hay registros disponibles.");
    }
    return /*#__PURE__*/React.createElement("ul", {
      className: "list-group list-group-flush"
    }, items.map((item, idx) => /*#__PURE__*/React.createElement("li", {
      key: idx,
      className: "list-group-item bg-transparent border-0 ps-0 py-1"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-check text-primary me-2 flex-shrink-0"
    }), item)));
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm mb-4 border-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4 border-bottom pb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-primary bg-opacity-10 p-3 rounded-circle me-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-doctor text-primary fa-xl"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "h4 mb-0 fw-bold"
  }, "Resumen Cl\xEDnico del Paciente"), /*#__PURE__*/React.createElement("small", {
    className: "text-muted d-flex align-items-center mt-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-robot me-1"
  }), "Generado por IA \u2022 ", new Date().toLocaleDateString()))), /*#__PURE__*/React.createElement(Button, {
    label: "Refrescar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-sync me-1"
    }),
    size: "small",
    onClick: () => refetch()
  })), /*#__PURE__*/React.createElement("div", {
    className: "row g-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-light p-4 rounded-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold text-primary mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-medical-alt me-2"
  }), "Resumen General"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-dark lh-lg",
    style: {
      fontSize: '1.05rem'
    }
  }, data.resumen_general || "No hay información suficiente para generar un resumen."))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 p-3 border rounded-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold text-dark mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-stethoscope text-danger me-2"
  }), "Diagn\xF3sticos"), renderList(data.diagnosticos))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 p-3 border rounded-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold text-dark mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-history text-info me-2"
  }), "Antecedentes Relevantes"), renderList(data.antecedentes_relevantes))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 p-3 border rounded-3"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold text-dark mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-pills text-success me-2"
  }), "Medicamentos"), renderList(data.medicamentos))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded-3 flex-grow-1"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold text-dark mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hand-holding-medical text-warning me-2"
  }), "Tratamiento Actual"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-muted"
  }, data.tratamiento_actual || "No especificado.")), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded-3 flex-grow-1 bg-primary bg-opacity-10 border-primary border-opacity-25"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold text-primary mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-calendar-check me-2"
  }), "Plan de Seguimiento"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-dark"
  }, data.plan_de_seguimiento || "No especificado."))))), /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-3 border-top text-center text-muted small"
  }, /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-circle-info me-2"
  }), "Este reporte ha sido generado autom\xE1ticamente por inteligencia artificial. Por favor verifique la informaci\xF3n con los registros cl\xEDnicos oficiales."))));
};