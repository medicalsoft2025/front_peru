import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { TreeSelect } from 'primereact/treeselect';
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
import { aiService } from "../../ai/services/AIService.js";
import { showNotification } from "../../../services/utilidades.js";
export const AIFormGenerator = ({
  visible,
  onHide,
  onImport,
  treeOptions
}) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedConfig, setGeneratedConfig] = useState(null);
  const [targetNodeKey, setTargetNodeKey] = useState(null);
  useEffect(() => {
    if (visible) {
      setPrompt('');
      setLoading(false);
      setGeneratedConfig(null);
      setTargetNodeKey(null);
    }
  }, [visible]);
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setGeneratedConfig(null);
    try {
      const response = await aiService.generateDynamicForm({
        prompt
      });
      if (response.data && response.data.form_structure && response.data.form_structure.length > 0) {
        // The AI returns an array, but we usually want to import the contents. 
        // If it returns a single form/container, we might want to unwrap or keep it.
        // Given the example, it returns a structure array. 
        // Let's take the first element if it's a wrapper, or wrap it.
        // The example shows "form_structure": [{ name: "...", type: "form", ... }]
        // We will take the first element as the root of the generated content.
        setGeneratedConfig(response.data.form_structure[0]);
      } else {
        showNotification({
          type: 'warning',
          message: 'La IA no devolvió una estructura válida.'
        });
      }
    } catch (error) {
      console.error(error);
      showNotification({
        type: 'error',
        message: 'Error al generar el formulario.'
      });
    } finally {
      setLoading(false);
    }
  };
  const handleImportClick = () => {
    if (!generatedConfig || !targetNodeKey) return;
    onImport(generatedConfig, targetNodeKey);
    // Reset state after import if needed, or leave it for next time?
    // Usually better to reset or let the parent control visibility which effectively resets if we didn't persist state.
    // But here we are inside a Dialog that stays mounted? No, usually Dialog contents are kept.
    // Let's clear generated config to allow fresh start next time? 
    // Or keep it so user can import again? Let's keep it.
    onHide();
  };
  const footer = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    severity: "secondary",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-1"
    }),
    onClick: onHide
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Importar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-check me-1"
    }),
    onClick: handleImportClick,
    disabled: !generatedConfig || !targetNodeKey,
    autoFocus: true
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Generar Formulario con IA",
    visible: visible,
    style: {
      width: '80vw'
    },
    onHide: onHide,
    footer: footer,
    maximizable: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4 d-flex flex-column gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "prompt",
    className: "font-bold"
  }, "Describe el formulario que deseas crear"), /*#__PURE__*/React.createElement(InputTextarea, {
    id: "prompt",
    rows: 5,
    value: prompt,
    onChange: e => setPrompt(e.target.value),
    placeholder: "Ej: Historia cl\xEDnica de endocrinolog\xEDa con datos del paciente, antecedentes familiares, medicamentos actuales...",
    className: "w-100"
  }), /*#__PURE__*/React.createElement(Button, {
    label: loading ? "Generando..." : "Generar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-bolt me-1"
    }),
    onClick: handleGenerate,
    disabled: loading || !prompt.trim()
  })), generatedConfig && /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2 mt-3"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "targetNode",
    className: "font-bold"
  }, "Seleccionar ubicaci\xF3n de importaci\xF3n"), /*#__PURE__*/React.createElement(TreeSelect, {
    value: targetNodeKey,
    options: treeOptions,
    onChange: e => setTargetNodeKey(e.value),
    placeholder: "Seleccionar nodo destino",
    className: "w-100",
    filter: true,
    filterMode: "strict"
  }), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "El formulario generado se agregar\xE1 como hijo del nodo seleccionado."))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-8"
  }, /*#__PURE__*/React.createElement("label", {
    className: "font-bold mb-2 d-block"
  }, "Previsualizaci\xF3n"), /*#__PURE__*/React.createElement("div", {
    className: "border rounded p-3 bg-light",
    style: {
      minHeight: '400px',
      maxHeight: '600px',
      overflowY: 'auto'
    }
  }, loading ? /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center h-100 text-muted"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-spinner fa-spin me-1"
  })) : generatedConfig ? /*#__PURE__*/React.createElement(DynamicForm, {
    config: generatedConfig,
    onSubmit: () => {}
  }) : /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center h-100 text-muted"
  }, "Genera un formulario para ver la previsualizaci\xF3n aqu\xED.")))));
};