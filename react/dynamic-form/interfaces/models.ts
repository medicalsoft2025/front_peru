import { TreeNode } from "primereact/treenode";
import { FieldPath, RegisterOptions } from "react-hook-form";

export interface FieldState {
    visible: boolean;
    disabled: boolean;
    options?: Array<{ label: string; value: any }>;
    treeOptions?: TreeNode[]
    loading?: boolean;
}

export interface DynamicCondition {
    field: string; // Campo que se evalúa
    operator:
    | "equals"
    | "notEquals"
    | "greaterThan"
    | "lessThan"
    | "contains"
    | "isEmpty"
    | "isNotEmpty"
    | "sumGreaterThan"
    | "sumLessThan"
    | "sumEquals"
    | "anyEquals"
    | "allEquals";
    value?: any; // Valor a comparar
    source?: "static" | "field"; // Origen del valor (estático o campo)
    logicalOperator?: "AND" | "OR"; // Para múltiples condiciones
    conditions?: DynamicCondition[]; // Condiciones anidadas
}

export interface DynamicAction {
    type: "show" | "hide" | "enable" | "disable" | "setValue" | "setOptions" | "validationError";
    target: string; // Campo objetivo
    value?: any; // Valor a establecer
    expression?: string; // Expresión a evaluar (ej: "{{field1}} + {{field2}}")
    optionsUrl?: string; // URL para opciones asíncronas
    optionsTransform?: { label: string; value: string }; // Transformar datos de API
}

export interface DynamicRule {
    condition: DynamicCondition | DynamicCondition[];
    actions: DynamicAction | DynamicAction[];
}

export type DynamicFieldTypes =
    "text"
    | "textarea"
    | "number"
    | "select"
    | "checkbox"
    | "radio"
    | "colorpicker"
    | "date"
    | "datetime"
    | "editor"
    | "multiselect"
    | "password"
    | "email"
    | "file"
    | "tree-select"
    | "chips"
    | "rating"
    | "slider";

export type DynamicArrayFieldFormat =
    "default"
    | "table";

export type DynamicContainerType =
    "card"
    | "form"
    | "tabs"
    | "tab"
    | "accordion"
    | "stepper"
    | "array"
    | "container";

export type AsyncParamSource = "field" | "url" | "static";
export type AsyncParamLocation = "query" | "path" | "body";

export type DynamicElementType = DynamicFieldTypes | DynamicContainerType;

export interface AsyncParam {
    key: string;       // Parameter name (in query/body) or placeholder (in path config)
    source: AsyncParamSource;
    value: string;     // Field name, URL param name, or Static value
    location?: AsyncParamLocation; // Default: 'query' for GET, 'body' for POST?
}

export interface AsyncValidationConfig {
    endpoint: string;
    method?: string;
    debounceTime?: number;
    message?: string;
    headers?: Record<string, string>;
    params?: AsyncParam[];
}

export interface AsyncOptionsConfig {
    endpoint?: string;
    sourceKey?: string;
    method?: string;
    labelKey: string;
    valueKey: string;
    headers?: Record<string, string>;
    params?: AsyncParam[];
    dependsOn?: string;
    paramKey?: string;
}

export interface DynamicFormElementConfig {
    name?: string;
    type: DynamicElementType;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    value?: any;
    divider?: boolean;
    styleClass?: string;
    format?: string;
    showClear?: boolean;
    options?: Array<{ label: string; value: any }>;
    treeOptions?: TreeNode[];
    validation?: RegisterOptions<any, FieldPath<any>>;
    rows?: number;
    rules?: DynamicRule[];
    dependencies?: string[];
    asyncValidation?: AsyncValidationConfig;
    asyncOptions?: AsyncOptionsConfig;
    debounceTime?: number;
    aiSuggestion?: string; // Hint/Context for AI to generate suggestions for this field

    // Container Specific
    children?: DynamicFormElementConfig[];
    defaultActiveChildren?: string;
    initialValue?: any[]; // Valor inicial para arrays
    arrayConfig?: {
        addLabel?: string;
        removeLabel?: string;
        min?: number;
        max?: number;
        format?: DynamicArrayFieldFormat; // Formato de visualización
        tableConfig?: { // Configuración específica para el modo tabla
            paginator?: boolean;
            rows?: number;
            resizableColumns?: boolean;
            reorderableColumns?: boolean;
            sortable?: boolean;
            showGridlines?: boolean;
            stripedRows?: boolean;
        };
    };
    linear?: boolean;
    hasSubmitButton?: boolean;
    submitButtonIconPos?: "left" | "right";
    submitButtonIcon?: string;
    submitButtonLabel?: string;
    contentStyleClass?: string;

    // Legacy (to be removed)
    fields?: DynamicFormElementConfig[];
    containers?: DynamicFormElementConfig[];
    calendarMode?: "single" | "range" | "multiple";
}

// Keep these for backward compatibility during transition
export type DynamicFieldConfig = DynamicFormElementConfig;
export interface DynamicFormContainerConfig extends Partial<DynamicFormElementConfig> {
    type?: DynamicElementType;
}
