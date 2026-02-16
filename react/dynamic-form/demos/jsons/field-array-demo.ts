import { DynamicFormContainerConfig } from "../../interfaces/models";

export const fieldArrayDemo: DynamicFormContainerConfig = {
    containers: [
        {
            type: "form",
            name: "educationForm",
            containers: [
                {
                    type: "card",
                    name: "basicInfo",
                    label: "Datos Personales",
                    containers: [
                        {
                            fields: [
                                {
                                    name: "candidateName",
                                    type: "text",
                                    label: "Nombre del Candidato",
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "array",
                    name: "education",
                    label: "Historial Educativo (Array)",
                    arrayConfig: {
                        addLabel: "Agregar Educación",
                        removeLabel: "Quitar",
                        min: 1
                    },
                    containers: [
                        {
                            fields: [
                                {
                                    name: "degree",
                                    type: "select",
                                    label: "Nivel de Estudios",
                                    options: [
                                        { label: "Bachiller", value: "highschool" },
                                        { label: "Universitario", value: "university" },
                                        { label: "Otro", value: "other" }
                                    ],
                                    required: true
                                },
                                {
                                    name: "institution",
                                    type: "text",
                                    label: "Institución",
                                    required: true
                                }
                            ]
                        },
                        {
                            fields: [
                                {
                                    name: "otherDegree",
                                    type: "text",
                                    label: "Especifique otro",
                                    rules: [
                                        {
                                            condition: {
                                                field: "degree",
                                                // Regla scoped: buscará 'degree' dentro de MISMO item (ej: education.0.degree)
                                                operator: "equals",
                                                value: "other"
                                            },
                                            actions: {
                                                type: "show",
                                                target: "otherDegree"
                                            }
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
