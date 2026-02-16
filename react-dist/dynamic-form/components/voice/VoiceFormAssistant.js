import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { VoiceRecorder } from "./VoiceRecorder.js";
import { useFormContext } from "../../context/FormContext.js";
import { useFormContext as useRHFContext } from 'react-hook-form';
import { aiService } from "../../../ai/services/AIService.js";
export const VoiceFormAssistant = ({
  config,
  aiEndpoint = 'https://api.openai.com/v1/chat/completions',
  aiApiKey,
  aiProvider
}) => {
  const {
    getValues,
    reset
  } = useRHFContext();
  const {
    setFieldSuggestions
  } = useFormContext(); // Cast to access extended context property

  const [dialogVisible, setDialogVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const handleTranscription = async text => {
    setLoading(true);
    try {
      const currentValues = getValues();
      console.log("Sending to AI:", text);
      const response = await aiService.generateFormCompletion({
        transcribedText: text,
        formConfig: config,
        currentValues
      });
      setAiResponse(response.data);
      setDialogVisible(true);
    } catch (error) {
      console.error("AI Error:", error);
      // Ideally show a toast
      alert("Error procesando solicitud con IA");
    } finally {
      setLoading(false);
    }
  };
  const confirmFill = () => {
    if (aiResponse?.data) {
      console.log("AI Response:", aiResponse);
      // Updated approach: Use reset to properly update array fields and trigger re-renders
      const currentValues = getValues();
      const newValues = {
        ...currentValues,
        ...aiResponse.data
      };
      reset(newValues, {
        keepDefaultValues: true,
        // Optional: keep defaults if needed
        keepDirty: true // Optional: determine if we want to keep dirty flags
      });

      // Set suggestions if available
      if (aiResponse.suggestions && setFieldSuggestions) {
        console.log("Setting suggestions:", aiResponse.suggestions);
        setFieldSuggestions(aiResponse.suggestions);
      }

      // If using reset doesn't force re-render of complex arrays in some older RHF versions, we can try specific logic, 
      // but reset is the standard way to "load" new data into the form.

      setDialogVisible(false);
      setAiResponse(null);
    }
  };
  const cancelFill = () => {
    setDialogVisible(false);
    setAiResponse(null);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      zIndex: 100000
    }
  }, loading && /*#__PURE__*/React.createElement("div", {
    className: "bg-dark text-white p-2 rounded shadow mb-2 d-flex align-items-center gap-2",
    style: {
      position: 'absolute',
      bottom: '90px',
      left: '0',
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-spinner fa-spin"
  }), /*#__PURE__*/React.createElement("span", null, "Procesando solicitud con IA...")), /*#__PURE__*/React.createElement(VoiceRecorder, {
    onTranscriptionComplete: handleTranscription,
    onRecordingStateChange: state => console.log("State:", state)
  })), /*#__PURE__*/React.createElement(Dialog, {
    header: "Confirmaci\xF3n de Auto-relleno por IA",
    visible: dialogVisible,
    style: {
      width: '50vw'
    },
    footer: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-times"
      }),
      onClick: cancelFill,
      className: "p-button-text"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Confirmar y Llenar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-check"
      }),
      onClick: confirmFill,
      autoFocus: true
    })),
    onHide: cancelFill
  }, loading && /*#__PURE__*/React.createElement("p", null, "Procesando con IA..."), !loading && aiResponse && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Resumen"), /*#__PURE__*/React.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: aiResponse.summary
    }
  }))));
};