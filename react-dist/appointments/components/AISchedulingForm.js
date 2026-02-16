import React, { useState } from 'react';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { aiService } from "../../ai/services/AIService.js";
export const AISchedulingForm = ({
  onAvailabilityFound,
  onLoading
}) => {
  const [instruction, setInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSearchIA = async () => {
    if (!instruction.trim()) return;
    setIsLoading(true);
    onLoading(true);
    try {
      const response = await aiService.userAvailabilitiesIntelligentSearch({
        instruction
      });
      // Structure from user: { filters_used: {}, availabilities: [] }
      // API response wrapper handling:
      const result = response.data || response;
      if (result.availabilities) {
        // Determine Mode: Inject instruction so Dialog knows it's AI Mode
        const filters = {
          ...result.filters_used,
          instruction
        };
        onAvailabilityFound(result.availabilities, filters);
      } else {
        console.warn("Unexpected AI response format", result);
        // Fallback if data is direct array? No, user specified object structure.
      }
    } catch (error) {
      console.error("Error querying AI", error);
    } finally {
      onLoading(false);
      setIsLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 border rounded bg-primary bg-opacity-10 border-primary border-opacity-25"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3 text-primary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-wand-magic-sparkles me-2 fa-lg"
  }), /*#__PURE__*/React.createElement("h6", {
    className: "mb-0 fw-bold"
  }, "Agendamiento Inteligente")), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(InputTextarea, {
    value: instruction,
    onChange: e => setInstruction(e.target.value),
    rows: 3,
    className: "w-100 border-0 shadow-sm",
    placeholder: "Ej: Necesito una cita de cardiolog\xEDa para la pr\xF3xima semana en las ma\xF1anas...",
    autoResize: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: isLoading ? "Buscando..." : "Consultar Disponibilidad",
    icon: isLoading ? "pi pi-spinner pi-spin" : "pi pi-bolt",
    className: "p-button-primary p-button-sm",
    onClick: handleSearchIA,
    disabled: !instruction.trim() || isLoading
  })));
};