export interface EnvironmentalArea {
    id: number
    name: string
    branch_id: number
    company_id: number
    created_at: string
    updated_at: string
    deleted_at: any
    protocols: EnvironmentalAreaProtocol[]
}

export interface EnvironmentalAreaProtocol {
    id: number
    name: string
    environmental_area_id: number
    branch_id: number
    company_id: number
    created_at: string
    updated_at: string
    deleted_at: any
    area: EnvironmentalArea;
}

export interface EnvironmentalWasteCategory {
    id: number
    name: string
    branch_id: number
    company_id: number
    created_at: string
    updated_at: string
    deleted_at: any
}

export interface EnvironmentalWasteRecord {
    id: number;
    environmental_waste_category_id: number;
    date: string;
    value: string;
    user_id: number;
    branch_id: number;
    company_id: number;
    details: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    issuer_id: string;
    category: EnvironmentalWasteCategory;
}

export interface EnvironmentalCleaningRecord {
    id: number;
    environmental_area_protocol_id: number;
    date: string;
    is_compliant: boolean;
    user_id: number;
    branch_id: number;
    company_id: number;
    details: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    protocol: EnvironmentalAreaProtocol;
}

export interface EnvironmentalHumidityRecord {
    id: number;
    environmental_area_id: number;
    date: string;
    value_am?: string;
    value_pm?: string;
    user_id: number;
    branch_id: number;
    company_id: number;
    details: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    area: EnvironmentalArea;
}

export interface EnvironmentalTemperatureRecord {
    id: number;
    environmental_area_id: number;
    date: string;
    value_am?: string;
    value_pm?: string;
    user_id: number;
    branch_id: number;
    company_id: number;
    details: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    area: EnvironmentalArea;
}