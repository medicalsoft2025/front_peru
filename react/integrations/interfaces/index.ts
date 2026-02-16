export type ConfigFieldType = "text" | "list" | "file" | "password" | "checkbox" | "button";

export interface ConfigFieldI {
    field: string;
    label: string;
    type?: ConfigFieldType;
    initialValue?: any;
    source?: string;
    sourceType?: string;
    multiple?: boolean;
    placeholder?: string;
    description?: string;
}

export interface UseIntegrationFormProps {
    configs: any[];
    initialConfigFields: ConfigFieldI[];
}

export interface DynamicIntegrationFormProps {
    configs: any[];
    initialConfigFields: ConfigFieldI[];
    onSubmit: (data: any) => void;
}

export interface DynamicConfigFieldProps {
    field: string;
    label: string;
    initialValue?: any;
    source?: string;
    sourceType?: string;
    multiple?: boolean;
    placeholder?: string;
    type?: ConfigFieldType;
    description?: string;
    onChange: (value: any) => void;
    onFileChange?: ({ field, file }: { field: string; file: File | null }) => void;
}

export interface DynamicConfigFieldListProps extends DynamicConfigFieldProps {
    options?: any[];
}

export interface GenericListItemI {
    label: string;
    value: string;
}

export interface IntegrationConfigFormProps {
    configs?: any;
    configFields: ConfigFieldI[];
    onSubmit?: (data: any) => void;
}