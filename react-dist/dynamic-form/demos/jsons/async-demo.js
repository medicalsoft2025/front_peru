export const asyncDemo = {
  containers: [{
    type: "form",
    name: "asyncForm",
    containers: [{
      type: "card",
      name: "optionsSection",
      label: "1. Selects en Cascada (Params Multiples + URL)",
      containers: [{
        fields: [{
          name: "user",
          label: "Usuario (Fuente API)",
          type: "select",
          required: true,
          placeholder: "Seleccione usuario...",
          asyncOptions: {
            endpoint: "https://jsonplaceholder.typicode.com/users",
            labelKey: "name",
            valueKey: "id"
          },
          debounceTime: 500
        }, {
          name: "posts",
          label: "Posts (Depende de: User Select + URL param ?type=...)",
          type: "select",
          placeholder: "Seleccione post...",
          asyncOptions: {
            endpoint: "https://jsonplaceholder.typicode.com/posts",
            labelKey: "title",
            valueKey: "id",
            // Advanced params configuration
            params: [{
              key: "userId",
              source: "field",
              value: "asyncForm.user",
              // Depends on the user field above
              location: "query"
            }, {
              key: "type_filter",
              source: "url",
              value: "type",
              // Reads ?type=something from browser URL
              location: "query"
            }]
          }
        }]
      }]
    }, {
      type: "card",
      name: "validationSection",
      label: "2. Validación Async (Custom Payload)",
      containers: [{
        fields: [{
          name: "customCheck",
          label: "Validación Compleja (Envia Contexto)",
          type: "text",
          placeholder: "Escribe algo...",
          asyncValidation: {
            endpoint: "https://jsonplaceholder.typicode.com/posts",
            method: "POST",
            message: "Falló validación (Simulada)",
            params: [
            // Send context from the user selected above
            {
              key: "contextUser",
              source: "field",
              value: "asyncForm.user",
              location: "body"
            },
            // Send a static check value
            {
              key: "adminCheck",
              source: "static",
              value: "TRUE",
              location: "body"
            }],
            debounceTime: 500
          }
        }, {
          name: "simpleText",
          label: "Simple Text",
          type: "text",
          placeholder: "Escribe algo...",
          debounceTime: 500,
          required: true
        }]
      }]
    }],
    hasSubmitButton: true,
    submitButtonLabel: "Guardar"
  }]
};