import { DynamicFormContainerConfig } from "../../interfaces/models";
import { fieldArrayDemo } from "./field-array-demo";

export const tableArrayDemo: DynamicFormContainerConfig = {
    containers: [
        {
            type: "form",
            name: "inventoryForm",
            containers: [
                { ...fieldArrayDemo },
                {
                    type: "array",
                    name: "products",
                    label: "Inventario de Productos (Tabla)",
                    arrayConfig: {
                        addLabel: "Nuevo Producto",
                        removeLabel: "Borrar",
                        min: 1,
                        format: "table",
                        tableConfig: {
                            showGridlines: true,
                            stripedRows: true,
                            paginator: true,
                            rows: 5,
                            sortable: true
                        }
                    },
                    containers: [
                        {
                            name: "basicInfo",
                            label: "Información Básica",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "code",
                                            type: "text",
                                            label: "Código",
                                            required: true,
                                            styleClass: "mb-2"
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            name: "details",
                            label: "Detalles",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "category",
                                            type: "select",
                                            label: "Categoría",
                                            options: [
                                                { label: "Electrónica", value: "electronics" },
                                                { label: "Ropa", value: "clothing" },
                                                { label: "Hogar", value: "home" }
                                            ],
                                            styleClass: "mb-2",
                                            required: true
                                        },
                                        {
                                            name: "quantity",
                                            type: "number",
                                            label: "Cantidad",
                                            required: true
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            name: "status",
                            label: "Estado",
                            containers: [
                                {
                                    fields: [
                                        {
                                            name: "active",
                                            type: "checkbox",
                                            label: "Activo",
                                            rules: [
                                                {
                                                    condition: {
                                                        field: "quantity",
                                                        operator: "lessThan",
                                                        value: 5
                                                    },
                                                    actions: {
                                                        type: "hide",
                                                        target: "active" // target inside this container
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ],
                        }
                    ]
                }
            ],
            hasSubmitButton: true
        },
    ],
};
