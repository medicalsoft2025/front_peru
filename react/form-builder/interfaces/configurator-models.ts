export type RuleOperator = "equals" | "notEquals" | "in" | "notIn" | "contains" | "notContains" | "isEmpty" | "isNotEmpty";

export interface RuleCondition {
    field: string;
    operator: RuleOperator;
    value: any;
}

export interface ConfigRule {
    conditions: RuleCondition[];
    logic?: "and" | "or";
    effect: Partial<ConfigField>;
}

export interface ConfigField {
    path: string;
    key: string;
    label: string;
    description?: string;
    inputType: "text" | "textarea" | "number" | "select" | "checkbox" | "keyValueTable" | "objectArray" | "nestedObject" | "treeSelect" | "radio";
    required?: boolean;
    visible?: boolean | { [key: string]: any[] }; // Dependency visibility
    rules?: ConfigRule[]; // Advanced conditional rules
    treeOptions?: any[]; // For treeSelect
    placeholder?: string;
    options?: { label: string; value: any }[];
    min?: number;
    max?: number;
    suffix?: string;
    validation?: {
        pattern?: string;
        errorMessage?: string;
    };
    defaultValue?: any;
    // For keyValueTable
    columns?: ConfigField[];
    addButtonLabel?: string;
    removeButtonLabel?: string;
    // For objectArray
    fields?: ConfigField[];
}

export interface JsonConfigMetadata {
    fields: ConfigField[];
    defaultData: any;
}
