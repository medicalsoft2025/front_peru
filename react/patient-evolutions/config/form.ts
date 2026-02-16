import { DynamicFormElementConfig } from "../../dynamic-form/interfaces/models";

export const formConfig: DynamicFormElementConfig = {
    type: "container",
    children: [
        {
            type: "form",
            children: [
                {
                    type: "textarea",
                    name: "note",
                    label: "Nota de evolución",
                    required: true
                }
            ],
            hasSubmitButton: true,
            submitButtonLabel: "Guardar"
        }
    ]
}