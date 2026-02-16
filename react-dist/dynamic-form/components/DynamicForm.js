import React, { forwardRef, useEffect, useMemo, useState } from "react";
import { DynamicFormContainer } from "./containers/DynamicFormContainer.js";
import { useDynamicForm } from "../hooks/useDynamicForm.js";
import { FormProvider as FormProviderRHF } from "react-hook-form";
import { useFieldConditions } from "../hooks/useFieldConditions.js";
import { FormProvider } from "../providers/FormProvider.js";
import { sources as sourcesConfig } from "../config/sources.js";
import { VoiceFormAssistant } from "./voice/VoiceFormAssistant.js";
export const DynamicForm = /*#__PURE__*/forwardRef((props, ref) => {
  const {
    config,
    data,
    onSubmit,
    onIsInvalidChange,
    loading,
    className = "",
    onChange,
    setFormInvalid,
    executeFieldConditionsOnInit = false,
    onElementSelect,
    sources: sourcesProp,
    initialFieldStates,
    aiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent',
    aiApiKey = 'AIzaSyB5QtuH4IebTsvq3fpN-82jhcarlB5WYh4',
    aiProvider = 'gemini',
    showVoiceAssistant = false
  } = props;
  const sources = useMemo(() => {
    return {
      ...sourcesConfig,
      ...sourcesProp
    };
  }, [sourcesProp]);
  const [fieldSuggestions, setFieldSuggestions] = useState({});
  const {
    form,
    emitSubmitData
  } = useDynamicForm({
    config,
    data,
    onSubmit,
    onChange,
    setFormInvalid,
    ref
  });
  const {
    fieldStates
  } = useFieldConditions({
    config,
    form,
    executeOnInit: !data || executeFieldConditionsOnInit,
    initialFieldStates
  });
  const formContextValue = useMemo(() => ({
    fieldStates,
    setFieldState: (fieldPath, state) => {},
    form: form,
    onElementSelect,
    sources,
    fieldSuggestions,
    // Add to context
    setFieldSuggestions // Add to context
  }), [fieldStates, form, onElementSelect, sources, fieldSuggestions]);
  useEffect(() => {
    if (form.formState.isValid) {
      onIsInvalidChange?.(false);
    } else {
      onIsInvalidChange?.(true);
    }
  }, [form.formState.isValid]);
  return /*#__PURE__*/React.createElement(FormProviderRHF, form, /*#__PURE__*/React.createElement(FormProvider, {
    value: formContextValue
  }, /*#__PURE__*/React.createElement("form", {
    className: className
  }, (config.children || config.containers)?.map((child, index) => /*#__PURE__*/React.createElement(DynamicFormContainer, {
    key: child.name || `element-${index}`,
    config: child,
    loading: loading,
    onSubmit: emitSubmitData,
    form: form
  }))), showVoiceAssistant && /*#__PURE__*/React.createElement(VoiceFormAssistant, {
    config: config,
    aiEndpoint: aiEndpoint,
    aiApiKey: aiApiKey,
    aiProvider: aiProvider
  })));
});