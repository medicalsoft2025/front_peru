import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Skeleton } from 'primereact/skeleton';
import { aiService } from "../ai/services/AIService.js";
export const ClinicalRecordSummary = ({
  clinicalRecordId,
  visible,
  onHide
}) => {
  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['clinicalRecordSummary', clinicalRecordId],
    queryFn: async () => {
      if (!clinicalRecordId) return null;
      const response = await aiService.clinicalRecordSummary({
        clinicalRecordId: clinicalRecordId.toString()
      });

      // Handle response structure logic
      // Structure provided: { data: { response: { ...fields } } }
      if (response.data?.response?.resumen_narrativo_consulta) {
        return response.data.response;
      }
      // Fallback
      if (response.data?.resumen_narrativo_consulta) {
        return response.data;
      }
      // Or message based like patient summary
      if (response.message?.response?.resumen_narrativo_consulta) {
        return response.message.response;
      }
      throw new Error("Invalid response format");
    },
    enabled: !!clinicalRecordId && visible,
    // Only fetch when ID exists and dialog is open
    retry: false,
    staleTime: 1000 * 60 * 15
  });
  const renderLoading = () => /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(Skeleton, {
    width: "40%",
    height: "1.5rem",
    className: "mb-2"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "100%",
    height: "6rem"
  })), /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-4"
  }, /*#__PURE__*/React.createElement(Skeleton, {
    width: "50%",
    height: "1.5rem",
    className: "mb-2"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "100%",
    height: "4rem"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 mb-4"
  }, /*#__PURE__*/React.createElement(Skeleton, {
    width: "50%",
    height: "1.5rem",
    className: "mb-2"
  }), /*#__PURE__*/React.createElement(Skeleton, {
    width: "100%",
    height: "4rem"
  }))));
  const renderError = () => /*#__PURE__*/React.createElement("div", {
    className: "text-center py-5"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-triangle-exclamation text-danger fa-3x mb-3"
  }), /*#__PURE__*/React.createElement("h4", {
    className: "text-danger"
  }, "Error al cargar resumen"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted mb-4"
  }, "No se pudo generar el resumen de esta historia cl\xEDnica."), /*#__PURE__*/React.createElement(Button, {
    label: "Reintentar",
    icon: "pi pi-refresh",
    className: "p-button-danger p-button-outlined",
    onClick: () => refetch()
  }));
  const renderList = (items, icon = "fa-check", emptyText = "Ninguno") => {
    if (!items || items.length === 0) return /*#__PURE__*/React.createElement("p", {
      className: "text-muted fst-italic mb-0"
    }, emptyText);
    return /*#__PURE__*/React.createElement("ul", {
      className: "list-group list-group-flush mb-0"
    }, items.map((item, idx) => /*#__PURE__*/React.createElement("li", {
      key: idx,
      className: "list-group-item bg-transparent border-0 ps-0 py-1"
    }, /*#__PURE__*/React.createElement("i", {
      className: `fa-solid ${icon} text-primary me-2`
    }), item)));
  };
  return /*#__PURE__*/React.createElement(Dialog, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-robot text-primary me-2"
    }), /*#__PURE__*/React.createElement("span", null, "Resumen IA de Historia Cl\xEDnica")),
    visible: visible,
    style: {
      width: '90vw',
      maxWidth: '900px'
    },
    onHide: onHide,
    maximizable: true,
    modal: true,
    className: "p-fluid"
  }, isLoading ? renderLoading() : isError || !data ? renderError() : /*#__PURE__*/React.createElement("div", {
    className: "container-fluid py-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-light border shadow-sm mb-4"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "fw-bold text-primary mb-2"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-invoice me-2"
  }), "Resumen Narrativo"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-dark lh-base",
    style: {
      fontSize: '1.05rem',
      whiteSpace: 'pre-line'
    }
  }, data.resumen_narrativo_consulta)), /*#__PURE__*/React.createElement("div", {
    className: "row g-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 p-3 border rounded shadow-sm bg-white"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "fw-bold text-dark border-bottom pb-2 mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-stethoscope text-danger me-2"
  }), "Diagn\xF3sticos Identificados"), renderList(data.diagnosticos_identificados))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 p-3 border rounded shadow-sm bg-white"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "fw-bold text-dark border-bottom pb-2 mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-magnifying-glass text-info me-2"
  }), "Hallazgos Cl\xEDnicos Clave"), renderList(data.hallazgos_clinicos_clave, "fa-notes-medical"))), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-3 border rounded shadow-sm bg-white"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "fw-bold text-dark border-bottom pb-2 mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-hand-holding-medical text-success me-2"
  }), "Intervenciones Terap\xE9uticas"), /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-secondary mb-2"
  }, "Tratamiento Farmacol\xF3gico"), renderList(data.intervenciones_terapeuticas?.tratamiento_farmacologico, "fa-pills")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-secondary mb-2"
  }, "Estudios Solicitados"), renderList(data.intervenciones_terapeuticas?.estudios_solicitados, "fa-microscope")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-secondary mb-2"
  }, "Incapacidades Otorgadas"), renderList(data.intervenciones_terapeuticas?.incapacidades_otorgadas, "fa-bed")), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-secondary mb-2"
  }, "Remisiones Realizadas"), renderList(data.intervenciones_terapeuticas?.remisiones_realizadas, "fa-share-from-square"))))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 p-3 border rounded shadow-sm bg-white"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "fw-bold text-dark border-bottom pb-2 mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-list-check text-warning me-2"
  }), "Seguimiento"), data.seguimiento_y_evolucion?.plan_seguimiento_inferido && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", {
    className: "d-block text-secondary mb-1"
  }, "Plan Inferido:"), /*#__PURE__*/React.createElement("p", {
    className: "small text-muted mb-0"
  }, data.seguimiento_y_evolucion.plan_seguimiento_inferido)), data.seguimiento_y_evolucion?.profesional_a_cargo && /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-end"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-secondary fst-italic"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-user-md me-1"
  }), data.seguimiento_y_evolucion.profesional_a_cargo)))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 p-3 bg-primary bg-opacity-10 border border-primary border-opacity-25 rounded d-flex flex-column justify-content-center"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "fw-bold text-primary mb-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-star me-2"
  }), "S\xEDntesis Final"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0 text-dark small"
  }, data.sintesis_final_consulta))))));
};