export const formConfig = {
  type: "container",
  children: [{
    type: "form",
    children: [{
      type: "textarea",
      name: "note",
      label: "Nota de evolución",
      required: true
    }],
    hasSubmitButton: true,
    submitButtonLabel: "Guardar"
  }]
};