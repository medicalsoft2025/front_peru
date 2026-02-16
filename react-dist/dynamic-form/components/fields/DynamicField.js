import React, { useContext, useMemo, useRef } from "react";
import { getValueByPath } from "../../../../services/utilidades.js";
import { FormContext } from "../../context/FormContext.js";
import { useVisibility } from "../../context/VisibilityContext.js";
import { DynamicInputText } from "./inputs/DynamicInputText.js";
import { DynamicSelect } from "./inputs/DynamicSelect.js";
import { DynamicMultiSelect } from "./inputs/DynamicMultiSelect.js";
import { DynamicCalendar } from "./inputs/DynamicCalendar.js";
import { DynamicCheckbox } from "./inputs/DynamicCheckbox.js";
import { DynamicRadio } from "./inputs/DynamicRadio.js";
import { DynamicInputNumber } from "./inputs/DynamicInputNumber.js";
import { DynamicInputTextarea } from "./inputs/DynamicInputTextarea.js";
import { DynamicColorPicker } from "./inputs/DynamicColorPicker.js";
import { DynamicEditor } from "./inputs/DynamicEditor.js";
import { DynamicTreeSelect } from "./inputs/DynamicTreeSelect.js";
import { DynamicChips } from "./inputs/DynamicChips.js";
import { DynamicRating } from "./inputs/DynamicRating.js";
import { DynamicSlider } from "./inputs/DynamicSlider.js";
export const DynamicField = ({
  field,
  form,
  parentPath = "",
  className = ""
}) => {
  const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name || "";
  const {
    formState: {
      errors
    }
  } = form;
  const {
    fieldStates,
    onElementSelect,
    fieldSuggestions
  } = useContext(FormContext);
  const {
    isVisible: parentVisibility
  } = useVisibility();
  const fieldState = fieldStates[fieldName] || {
    visible: true,
    disabled: false
  };
  const actualVisibility = fieldState.visible !== false && parentVisibility;
  React.useEffect(() => {
    form.trigger(fieldName);
  }, [actualVisibility, fieldName, form, field.required]);
  const validationCache = useRef(null);
  const validationRules = useMemo(() => {
    const rules = {
      required: field.required ? "Este campo es requerido" : false,
      ...field.validation
    };
    if (field.asyncValidation) {
      rules.validate = async value => {
        const config = field.asyncValidation;
        const {
          endpoint,
          method = "POST",
          message = "Valor inválido",
          headers,
          params
        } = config;
        const currentDataMap = {
          value
        };
        let cacheKey = `${endpoint}|${value}`;
        if (params) {
          params.forEach(param => {
            let val = null;
            if (param.source === "static") val = param.value;else if (param.source === "url") {
              const searchParams = new URLSearchParams(window.location.search);
              val = searchParams.get(param.value);
            } else if (param.source === "field") {
              val = form.getValues(param.value);
            }
            if (val !== undefined && val !== null) {
              currentDataMap[param.key] = val;
              cacheKey += `|${param.key}:${val}`;
            }
          });
        }
        if (validationCache.current && validationCache.current.key === cacheKey) {
          return validationCache.current.result;
        }
        try {
          let url = endpoint;
          let queryParams = new URLSearchParams();
          let bodyParams = {
            value
          };
          if (params) {
            params.forEach(param => {
              const val = currentDataMap[param.key];
              if (val === null || val === undefined || val === "") return;
              const location = param.location || (method === "POST" ? "body" : "query");
              if (location === "path") {
                const placeholder = `:${param.key}`;
                if (url.includes(placeholder)) {
                  url = url.replace(placeholder, String(val));
                } else {
                  url = url.replace(/\/+$/, "");
                  url = `${url}/${val}`;
                }
              } else if (location === "body") {
                bodyParams[param.key] = val;
              } else {
                queryParams.append(param.key, String(val));
              }
            });
          }
          const qs = queryParams.toString();
          if (qs) {
            url += (url.includes("?") ? "&" : "?") + qs;
          }
          const fetchOptions = {
            method,
            headers: {
              "Content-Type": "application/json",
              ...(headers || {})
            },
            body: method === "POST" || method === "PUT" ? JSON.stringify(bodyParams) : undefined
          };
          const response = await fetch(url, fetchOptions);
          if (!response.ok) {
            return message;
          } else {
            const data = await response.json();
            if (data.valid === false) return data.message || message;
          }
          validationCache.current = {
            key: cacheKey,
            result: true
          };
          return true;
        } catch (e) {
          console.error(e);
          return "Error de validación";
        }
      };
    }
    return rules;
  }, [field, field.required, field.validation, field.asyncValidation, field.validation?.pattern, field.validation?.min, field.validation?.max, field.validation?.minLength, field.validation?.maxLength, form.getValues]);
  const commonProps = {
    id: fieldName,
    disabled: field.disabled || fieldState.disabled || !actualVisibility,
    placeholder: field.placeholder
  };
  const renderController = () => {
    switch (field.type) {
      case "select":
        return /*#__PURE__*/React.createElement(DynamicSelect, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps,
          options: fieldState.options
        });
      case "tree-select":
        return /*#__PURE__*/React.createElement(DynamicTreeSelect, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps,
          options: fieldState.treeOptions
        });
      case "text":
      case undefined:
        return /*#__PURE__*/React.createElement(DynamicInputText, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          type: "text",
          commonProps: commonProps
        });
      case "email":
        return /*#__PURE__*/React.createElement(DynamicInputText, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: {
            ...validationRules,
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email inválido"
            }
          },
          type: "email",
          commonProps: commonProps
        });
      case "password":
        return /*#__PURE__*/React.createElement(DynamicInputText, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          type: "password",
          commonProps: commonProps
        });
      case "multiselect":
        return /*#__PURE__*/React.createElement(DynamicMultiSelect, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "date":
      case "datetime":
        return /*#__PURE__*/React.createElement(DynamicCalendar, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "checkbox":
        return /*#__PURE__*/React.createElement(DynamicCheckbox, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "radio":
        return /*#__PURE__*/React.createElement(DynamicRadio, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "number":
        return /*#__PURE__*/React.createElement(DynamicInputNumber, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "textarea":
        return /*#__PURE__*/React.createElement(DynamicInputTextarea, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "colorpicker":
        return /*#__PURE__*/React.createElement(DynamicColorPicker, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "editor":
        return /*#__PURE__*/React.createElement(DynamicEditor, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "chips":
        return /*#__PURE__*/React.createElement(DynamicChips, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "rating":
        return /*#__PURE__*/React.createElement(DynamicRating, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      case "slider":
        return /*#__PURE__*/React.createElement(DynamicSlider, {
          field: field,
          form: form,
          fieldName: fieldName,
          validationRules: validationRules,
          commonProps: commonProps
        });
      default:
        return null;
    }
  };
  const getFormErrorMessage = name => {
    const fieldErrors = getValueByPath(errors, name);
    return fieldErrors && /*#__PURE__*/React.createElement("small", {
      className: "p-error"
    }, fieldErrors.message?.toString());
  };
  const handleFieldClick = e => {
    if (onElementSelect) {
      e.stopPropagation();
      onElementSelect(field);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `dynamic-field ${className}`,
    onClick: handleFieldClick,
    style: {
      display: actualVisibility ? 'block' : 'none'
    }
  }, field.label && !["checkbox", "radio"].includes(field.type || "") && /*#__PURE__*/React.createElement("label", {
    htmlFor: fieldName,
    className: "form-label"
  }, field.label, field.required && /*#__PURE__*/React.createElement("span", {
    className: "required"
  }, "*")), renderController(), getFormErrorMessage(fieldName), fieldSuggestions && fieldSuggestions[fieldName] && fieldSuggestions[fieldName].length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "field-suggestions mt-1 d-flex flex-wrap gap-2"
  }, /*#__PURE__*/React.createElement("small", {
    className: "text-muted w-100 mb-1"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa fa-magic me-1"
  }), "Sugerencias IA:"), fieldSuggestions[fieldName].map((suggestion, idx) => /*#__PURE__*/React.createElement("span", {
    key: idx,
    className: "badge bg-light text-dark border cursor-pointer hover-shadow",
    style: {
      cursor: 'pointer'
    },
    onClick: e => {
      e.stopPropagation();
      form.setValue(fieldName, suggestion, {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  }, typeof suggestion === 'object' ? JSON.stringify(suggestion) : suggestion))));
};