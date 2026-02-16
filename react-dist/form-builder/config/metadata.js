export const asyncValidationMetadata = {
  defaultData: {
    endpoint: "",
    method: "POST",
    debounceTime: 300,
    message: "Validando...",
    headers: [],
    params: []
  },
  fields: [{
    path: "endpoint",
    key: "endpoint",
    label: "Endpoint / API URL",
    description: "URL del servicio de validación asíncrona",
    inputType: "text",
    required: true,
    placeholder: "https://api.ejemplo.com/validar",
    validation: {
      pattern: "^https?://.+",
      errorMessage: "Debe ser una URL válida (http:// o https://)"
    }
  }, {
    path: "method",
    key: "method",
    label: "Método HTTP",
    description: "Método HTTP para la solicitud de validación",
    inputType: "select",
    options: [{
      "value": "GET",
      "label": "GET"
    }, {
      "value": "POST",
      "label": "POST"
    }, {
      "value": "PUT",
      "label": "PUT"
    }, {
      "value": "PATCH",
      "label": "PATCH"
    }],
    defaultValue: "POST"
  }, {
    path: "debounceTime",
    key: "debounceTime",
    label: "Tiempo de debounce (ms)",
    description: "Tiempo de espera antes de ejecutar la validación",
    inputType: "number",
    min: 0,
    max: 5000,
    defaultValue: 300,
    suffix: "ms",
    placeholder: "300"
  }, {
    path: "message",
    key: "message",
    label: "Mensaje de validación",
    description: "Mensaje que se mostrará durante la validación",
    inputType: "text",
    placeholder: "Validando..."
  }, {
    path: "params",
    key: "params",
    label: "Parámetros de validación",
    description: "Parámetros que se enviarán al endpoint",
    inputType: "objectArray",
    fields: [{
      "path": "params[]",
      "key": "key",
      "label": "Nombre del parámetro",
      "inputType": "text",
      "required": true,
      "placeholder": "campo_a_validar"
    }, {
      "path": "params[]",
      "key": "source",
      "label": "Origen del valor",
      "inputType": "select",
      "options": [{
        "value": "field",
        "label": "Valor del campo"
      }, {
        "value": "url",
        "label": "URL Param"
      }, {
        "value": "static",
        "label": "Valor estático"
      }],
      "defaultValue": "field",
      "required": true
    }, {
      "path": "params[]",
      "key": "value",
      "label": "Valor",
      "inputType": "text",
      "required": true,
      "placeholder": "Nombre de campo o valor estático"
    }, {
      "path": "params[]",
      "key": "location",
      "label": "Ubicación",
      "inputType": "select",
      "options": [{
        "value": "query",
        "label": "Query String"
      }, {
        "value": "body",
        "label": "Body JSON"
      }, {
        "value": "path",
        "label": "Path Param"
      }],
      "defaultValue": "query"
    }],
    defaultValue: [],
    addButtonLabel: "Agregar parámetro",
    removeButtonLabel: "Eliminar parámetro"
  }, {
    path: "headers",
    key: "headers",
    label: "Cabeceras HTTP",
    inputType: "keyValueTable",
    columns: [{
      key: "name",
      label: "Nombre",
      inputType: "text",
      required: true,
      path: "name"
    }, {
      key: "value",
      label: "Valor",
      inputType: "text",
      required: true,
      path: "value"
    }],
    defaultValue: [],
    addButtonLabel: "Agregar cabecera",
    removeButtonLabel: "Eliminar"
  }]
};
export const asyncOptionsMetadata = {
  defaultData: {
    endpoint: "",
    method: "GET",
    labelKey: "label",
    valueKey: "value",
    headers: [],
    params: []
  },
  fields: [{
    path: "endpoint",
    key: "endpoint",
    label: "Endpoint / API URL",
    description: "URL del servicio de opciones",
    inputType: "text",
    required: true,
    placeholder: "https://api.ejemplo.com/opciones",
    validation: {
      pattern: "^https?://.+",
      errorMessage: "Debe ser una URL válida (http:// o https://)"
    }
  }, {
    path: "method",
    key: "method",
    label: "Método HTTP",
    inputType: "select",
    options: [{
      "value": "GET",
      "label": "GET"
    }, {
      "value": "POST",
      "label": "POST"
    }],
    defaultValue: "GET"
  }, {
    path: "labelKey",
    key: "labelKey",
    label: "Clave de Etiqueta (Label Key)",
    description: "Nombre de la propiedad en la respuesta JSON para usar como etiqueta",
    inputType: "text",
    required: true,
    defaultValue: "label"
  }, {
    path: "valueKey",
    key: "valueKey",
    label: "Clave de Valor (Value Key)",
    description: "Nombre de la propiedad en la respuesta JSON para usar como valor",
    inputType: "text",
    required: true,
    defaultValue: "value"
  }, {
    path: "dependsOn",
    key: "dependsOn",
    label: "Depende de (Campo)",
    description: "Nombre del campo del cual dependen estas opciones (Cascade Select)",
    inputType: "text"
  }, {
    path: "paramKey",
    key: "paramKey",
    label: "Clave de Parámetro de Dependencia",
    description: "Nombre del parámetro que se enviará con el valor del campo dependiente",
    inputType: "text"
  }, {
    path: "params",
    key: "params",
    label: "Parámetros Adicionales",
    inputType: "objectArray",
    addButtonLabel: "Agregar parámetro",
    fields: asyncValidationMetadata.fields.find(f => f.key === "params").fields // Reuse params definition
  }, {
    path: "headers",
    key: "headers",
    label: "Cabeceras HTTP",
    inputType: "keyValueTable",
    columns: [{
      key: "name",
      label: "Nombre",
      inputType: "text",
      required: true,
      path: "name"
    }, {
      key: "value",
      label: "Valor",
      inputType: "text",
      required: true,
      path: "value"
    }],
    defaultValue: [],
    addButtonLabel: "Agregar cabecera",
    removeButtonLabel: "Eliminar"
  }]
};
export const ruleMetadata = {
  defaultData: {
    condition: [],
    actions: []
  },
  fields: [{
    path: "condition",
    key: "condition",
    label: "Condiciones",
    inputType: "objectArray",
    addButtonLabel: "Agregar Condición",
    fields: [{
      path: "field",
      key: "field",
      label: "Campo a evaluar",
      inputType: "treeSelect",
      required: true
    }, {
      path: "operator",
      key: "operator",
      label: "Operador",
      inputType: "select",
      required: true,
      options: [{
        value: "equals",
        label: "Igual a"
      }, {
        value: "notEquals",
        label: "Diferente de"
      }, {
        value: "greaterThan",
        label: "Mayor que"
      }, {
        value: "lessThan",
        label: "Menor que"
      }, {
        value: "contains",
        label: "Contiene"
      }, {
        value: "isEmpty",
        label: "Está vacío"
      }, {
        value: "isNotEmpty",
        label: "No está vacío"
      }, {
        value: "sumGreaterThan",
        label: "Suma mayor que (Array)"
      }, {
        value: "sumLessThan",
        label: "Suma menor que (Array)"
      }, {
        value: "sumEquals",
        label: "Suma igual a (Array)"
      }, {
        value: "anyEquals",
        label: "Alguno igual a (Array)"
      }, {
        value: "allEquals",
        label: "Todos igual a (Array)"
      }]
    }, {
      path: "source",
      key: "source",
      label: "Tipo de Valor",
      inputType: "select",
      options: [{
        value: "static",
        label: "Valor Estático"
      }, {
        value: "field",
        label: "Campo del Formulario"
      }],
      defaultValue: "static"
    }, {
      path: "value",
      key: "value",
      label: "Valor de comparación",
      inputType: "text"
    }, {
      path: "logicalOperator",
      key: "logicalOperator",
      label: "Operador lógico (para siguientes condiciones)",
      inputType: "select",
      options: [{
        value: "AND",
        label: "Y (AND)"
      }, {
        value: "OR",
        label: "O (OR)"
      }]
    }]
  }, {
    path: "actions",
    key: "actions",
    label: "Acciones",
    inputType: "objectArray",
    addButtonLabel: "Agregar Acción",
    fields: [{
      path: "type",
      key: "type",
      label: "Tipo de acción",
      inputType: "select",
      required: true,
      options: [{
        value: "show",
        label: "Mostrar campo"
      }, {
        value: "hide",
        label: "Ocultar campo"
      }, {
        value: "enable",
        label: "Habilitar campo"
      }, {
        value: "disable",
        label: "Deshabilitar campo"
      }, {
        value: "setValue",
        label: "Establecer valor"
      }, {
        value: "setOptions",
        label: "Establecer opciones"
      }, {
        value: "validationError",
        label: "Error de validación"
      }]
    }, {
      path: "target",
      key: "target",
      label: "Campo Objetivo",
      inputType: "treeSelect",
      required: true,
      description: "Nombre del campo que será afectado por la acción"
    }, {
      path: "value",
      key: "value",
      label: "Valor a establecer (opcional)",
      inputType: "text",
      description: "Solo para acción setValue"
    }, {
      path: "expression",
      key: "expression",
      label: "Expresión (opcional)",
      inputType: "text",
      description: "Ej: {{campo1}} + {{campo2}}"
    }]
  }]
};
export const arrayConfigMetadata = {
  defaultData: {
    format: "default"
  },
  fields: [{
    path: "addLabel",
    key: "addLabel",
    label: "Etiqueta de botón agregar",
    inputType: "text"
  }, {
    path: "removeLabel",
    key: "removeLabel",
    label: "Etiqueta de botón eliminar",
    inputType: "text"
  }, {
    path: "min",
    key: "min",
    label: "Mínimo de elementos",
    inputType: "number",
    defaultValue: 0
  }, {
    path: "max",
    key: "max",
    label: "Máximo de elementos",
    inputType: "number",
    defaultValue: 100
  }, {
    path: "format",
    key: "format",
    label: "Formato de visualización",
    inputType: "select",
    options: [{
      label: "Por defecto",
      value: "default"
    }, {
      label: "Tabla",
      value: "table"
    }]
  }, {
    path: "tableConfig",
    key: "tableConfig",
    label: "Configuración de Tabla",
    inputType: "nestedObject",
    visible: {
      format: ["table"]
    },
    fields: [{
      path: "paginator",
      key: "paginator",
      label: "Paginador",
      inputType: "checkbox"
    }, {
      path: "rows",
      key: "rows",
      label: "Filas por página",
      inputType: "number",
      rules: [{
        conditions: [{
          field: "paginator",
          operator: "equals",
          value: true
        }],
        effect: {
          visible: true
        }
      }, {
        conditions: [{
          field: "paginator",
          operator: "notEquals",
          value: true
        }],
        effect: {
          visible: false
        }
      }]
    }, {
      path: "resizableColumns",
      key: "resizableColumns",
      label: "Columnas redimensionables",
      inputType: "checkbox"
    }, {
      path: "reorderableColumns",
      key: "reorderableColumns",
      label: "Columnas reordenables",
      inputType: "checkbox"
    }, {
      path: "sortable",
      key: "sortable",
      label: "Ordenable",
      inputType: "checkbox"
    }, {
      path: "showGridlines",
      key: "showGridlines",
      label: "Mostrar líneas de cuadrícula",
      inputType: "checkbox"
    }, {
      path: "stripedRows",
      key: "stripedRows",
      label: "Filas alternas (Zebra)",
      inputType: "checkbox"
    }]
  }]
};
export const elementConfigMetadata = {
  defaultData: {
    children: []
  },
  fields: [{
    path: "name",
    key: "name",
    label: "Nombre (API Key / Identificador)",
    inputType: "text",
    required: true,
    rules: [{
      // Containers that DON'T need a name (they don't hold data directly)
      conditions: [{
        field: "type",
        operator: "in",
        value: ["card", "tabs", "tab", "accordion", "stepper", "container"]
      }],
      effect: {
        visible: false,
        required: false
      }
    }]
  }, {
    path: "type",
    key: "type",
    label: "Tipo de Elemento",
    inputType: "select",
    options: [
    // Fields
    {
      label: "Texto",
      value: "text"
    }, {
      label: "Número",
      value: "number"
    }, {
      label: "Area de texto",
      value: "textarea"
    }, {
      label: "Selección",
      value: "select"
    }, {
      label: "Checkbox",
      value: "checkbox"
    }, {
      label: "Radio",
      value: "radio"
    }, {
      label: "Fecha",
      value: "date"
    }, {
      label: "Multiselect",
      value: "multiselect"
    }, {
      label: "Password",
      value: "password"
    }, {
      label: "Rating",
      value: "rating"
    }, {
      label: "Slider",
      value: "slider"
    }, {
      label: "Editor HTML",
      value: "editor"
    }, {
      label: "Color",
      value: "colorpicker"
    }, {
      label: "Archivos",
      value: "file"
    },
    // Containers
    {
      label: "Formulario",
      value: "form"
    }, {
      label: "Tarjeta (Card)",
      value: "card"
    }, {
      label: "Pestañas (Tabs)",
      value: "tabs"
    }, {
      label: "Pestaña (Tab)",
      value: "tab"
    }, {
      label: "Contenedor",
      value: "container"
    }, {
      label: "Acordeón",
      value: "accordion"
    }, {
      label: "Array de Objetos",
      value: "array"
    }, {
      label: "Stepper",
      value: "stepper"
    }],
    rules: [{
      // If parent is a container that strictly uses generic containers as children (like Stepper)
      conditions: [{
        field: "$parent.type",
        operator: "in",
        value: ["stepper", "tabs", "accordion", "array"]
      }],
      effect: {
        visible: false,
        defaultValue: "container"
      }
    }, {
      conditions: [{
        field: "$parent.type",
        operator: "equals",
        value: "array"
      }, {
        field: "$parent.arrayConfig.format",
        operator: "notEquals",
        value: "table"
      }],
      effect: {
        visible: true
      }
    }]
  }, {
    path: "label",
    key: "label",
    label: "Etiqueta / Título",
    inputType: "text"
  }, {
    path: "placeholder",
    key: "placeholder",
    label: "Placeholder",
    inputType: "text",
    rules: [{
      conditions: [{
        field: "type",
        operator: "in",
        value: ["text", "number", "date", "password", "select", "multiselect", "textarea"]
      }],
      effect: {
        visible: true
      }
    }, {
      conditions: [{
        field: "type",
        operator: "notIn",
        value: ["text", "number", "date", "password", "select", "multiselect", "textarea"]
      }],
      effect: {
        visible: false
      }
    }]
  }, {
    path: "required",
    key: "required",
    label: "Obligatorio",
    inputType: "checkbox",
    visible: {
      type: ["text", "number", "date", "password", "select", "multiselect", "checkbox", "radio"]
    }
  }, {
    path: "disabled",
    key: "disabled",
    label: "Deshabilitado",
    inputType: "checkbox"
  }, {
    path: "styleClass",
    key: "styleClass",
    label: "Clase de estilo",
    inputType: "text"
  }, {
    path: "contentStyleClass",
    key: "contentStyleClass",
    label: "Clase de contenido",
    inputType: "text",
    visible: {
      type: ["form", "card", "tabs", "tab", "accordion", "stepper", "array"]
    }
  }, {
    path: "divider",
    key: "divider",
    label: "Mostrar divisor",
    inputType: "checkbox"
  }, {
    path: "options",
    key: "options",
    label: "Opciones Locales",
    inputType: "objectArray",
    addButtonLabel: "Agregar opción",
    fields: [{
      key: "label",
      label: "Texto",
      inputType: "text",
      required: true,
      path: "label"
    }, {
      key: "value",
      label: "Valor",
      inputType: "text",
      required: true,
      path: "value"
    }],
    visible: {
      type: ["select", "radio", "multiselect"]
    }
  }, {
    path: "asyncOptions",
    key: "asyncOptions",
    label: "Opciones Asíncronas (API)",
    inputType: "nestedObject",
    fields: asyncOptionsMetadata.fields,
    visible: {
      type: ["select", "multiselect"]
    }
  }, {
    path: "asyncValidation",
    key: "asyncValidation",
    label: "Validación Asíncrona",
    inputType: "nestedObject",
    fields: asyncValidationMetadata.fields,
    visible: {
      type: ["text", "number"]
    }
  }, {
    path: "aiSuggestion",
    key: "aiSuggestion",
    label: "Sugerencia para IA",
    description: "Instrucción específica para que la IA sepa qué sugerir en este campo (Ej: 'Sugiere nombres de medicamentos genéricos')",
    inputType: "textarea"
  }, {
    path: "arrayConfig",
    key: "arrayConfig",
    label: "Configuración de Array",
    inputType: "nestedObject",
    visible: {
      type: ["array"]
    },
    fields: arrayConfigMetadata.fields
  }, {
    path: "rules",
    key: "rules",
    label: "Reglas de lógica / Lógica de visibilidad",
    inputType: "objectArray",
    addButtonLabel: "Agregar Regla",
    fields: ruleMetadata.fields
  }, {
    path: "linear",
    key: "linear",
    label: "Lineal",
    inputType: "checkbox",
    visible: {
      type: ["stepper"]
    }
  }, {
    path: "hasSubmitButton",
    key: "hasSubmitButton",
    label: "Habilitar botón de enviar",
    inputType: "checkbox",
    visible: {
      type: ["form", "stepper", "card"]
    },
    rules: [{
      conditions: [{
        field: "type",
        operator: "equals",
        value: "form"
      }],
      effect: {
        label: "Habilitar botón Guardar (Submit)"
      }
    }]
  }, {
    path: "submitButtonLabel",
    key: "submitButtonLabel",
    label: "Texto botón enviar",
    inputType: "text",
    visible: {
      type: ["form", "stepper", "card"]
    }
  }]
};

// Update existing constants to point to the unified metadata
export const fieldConfigMetadata = elementConfigMetadata;
export const containerConfigMetadata = elementConfigMetadata;
export const nestedContainerConfigMetadata = elementConfigMetadata;
export const finalNestedContainerConfigMetadata = {
  defaultData: {
    children: []
  },
  fields: [...elementConfigMetadata.fields, {
    path: "children",
    key: "children",
    label: "Elementos anidados",
    inputType: "objectArray",
    addButtonLabel: "Agregar elemento",
    removeButtonLabel: "Eliminar elemento",
    defaultValue: [],
    visible: {
      type: ["form", "stepper", "card", "accordion", "array", "container", "tabs"]
    },
    rules: [{
      conditions: [{
        field: "type",
        operator: "equals",
        value: "stepper"
      }],
      effect: {
        addButtonLabel: "Añadir paso",
        label: "Pasos del Stepper"
      }
    }, {
      conditions: [{
        field: "type",
        operator: "equals",
        value: "tabs"
      }],
      effect: {
        addButtonLabel: "Añadir pestaña",
        label: "Pestañas"
      }
    }, {
      conditions: [{
        field: "type",
        operator: "equals",
        value: "accordion"
      }],
      effect: {
        addButtonLabel: "Añadir sección",
        label: "Secciones del acordeón"
      }
    }, {
      conditions: [{
        field: "type",
        operator: "equals",
        value: "array"
      }, {
        field: "arrayConfig.format",
        operator: "equals",
        value: "table"
      }],
      effect: {
        addButtonLabel: "Añadir columna",
        label: "Columnas"
      }
    }],
    fields: [...elementConfigMetadata.fields, {
      path: "children",
      key: "children",
      label: "Elementos anidados",
      inputType: "objectArray",
      addButtonLabel: "Agregar elemento",
      removeButtonLabel: "Eliminar elemento",
      defaultValue: [],
      visible: {
        type: ["form", "stepper", "card", "accordion", "array", "container"]
      },
      rules: [{
        conditions: [{
          field: "type",
          operator: "equals",
          value: "stepper"
        }],
        effect: {
          addButtonLabel: "Añadir paso",
          label: "Pasos del Stepper"
        }
      }, {
        conditions: [{
          field: "type",
          operator: "equals",
          value: "tabs"
        }],
        effect: {
          addButtonLabel: "Añadir pestaña",
          label: "Pestañas"
        }
      }, {
        conditions: [{
          field: "type",
          operator: "equals",
          value: "accordion"
        }],
        effect: {
          addButtonLabel: "Añadir sección",
          label: "Secciones del acordeón"
        }
      }, {
        conditions: [{
          field: "type",
          operator: "equals",
          value: "array"
        }, {
          field: "arrayConfig.format",
          operator: "equals",
          value: "table"
        }],
        effect: {
          addButtonLabel: "Añadir columna",
          label: "Columnas"
        }
      }],
      fields: elementConfigMetadata.fields
    }]
  }]
};