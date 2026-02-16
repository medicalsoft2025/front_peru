import { DynamicFormContainerConfig } from "../../interfaces/models";

export const complexContainerRules: DynamicFormContainerConfig = {
    containers: [
        {
            type: "form",
            name: "complexRulesForm",
            containers: [
                {
                    name: "mainControls",
                    fields: [
                        {
                            name: "showPersonalInfo",
                            type: "checkbox",
                            label: "Mostrar Información Personal",
                            value: false
                        },
                        {
                            name: "userType",
                            type: "select",
                            label: "Tipo de Usuario",
                            options: [
                                { label: "Básico", value: "basic" },
                                { label: "Avanzado", value: "advanced" }
                            ],
                            value: "basic"
                        }
                    ]
                },
                {
                    type: "card",
                    name: "personalInfoCard",
                    label: "Información Personal (Card Dinámica)",
                    rules: [
                        {
                            condition: {
                                field: "showPersonalInfo",
                                operator: "equals",
                                value: true
                            },
                            actions: {
                                type: "show",
                                target: "personalInfoCard"
                            }
                        }
                    ],
                    containers: [
                        {
                            name: "personalInfoContent",
                            fields: [
                                {
                                    name: "fullName",
                                    type: "text",
                                    label: "Nombre Completo",
                                    required: true
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "tabs",
                    name: "advancedTabs",
                    label: "Configuración Avanzada",
                    rules: [
                        {
                            condition: {
                                field: "userType",
                                operator: "equals",
                                value: "advanced"
                            },
                            actions: {
                                type: "show",
                                target: "advancedTabs"
                            }
                        }
                    ],
                    containers: [
                        {
                            name: "tab1",
                            label: "Preferencias",
                            type: "tab",
                            containers: [
                                {
                                    name: "tab1Content",
                                    fields: [
                                        {
                                            name: "newsletter",
                                            type: "checkbox",
                                            label: "Suscribirse al boletín"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "tab2",
                            label: "Seguridad",
                            type: "tab",
                            containers: [
                                {
                                    name: "tab2Content",
                                    fields: [
                                        {
                                            name: "2fa",
                                            type: "checkbox",
                                            label: "Activar 2FA"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
