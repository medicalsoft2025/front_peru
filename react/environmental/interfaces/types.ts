export interface EnvironmentalCalendarFilterItemInterface {
    id: string;
    name: string;
    value: any;
}

export interface EnvironmentalCalendarFilterTreeItemInterface extends EnvironmentalCalendarFilterItemInterface {
    subItems: EnvironmentalCalendarFilterItemInterface[];
}

export interface EnvironmentalCalendarFilterFormValues {
    name: string;
}

export interface StoreEnvironmentalAreaParams {
    name: string;
}

export interface StoreEnvironmentalWasteCategoryParams {
    name: string;
}

export interface StoreEnvironmentalAreaProtocolParams {
    name: string;
    environmental_area_id: string;
}

export type EnvironmentalCalendarFilterType = 'waste-category' | 'area' | 'protocol';

export interface StoreEnvironmentalWasteRecordParams {
    date: string;
    issuer_id: string; // Added user_id
    items: {
        category_id: number;
        value: number;
    }[];
}

export interface StoreEnvironmentalTemperatureRecordParams {
    date: string;
    items: {
        environmental_area_id: number;
        value_am?: number;
        value_pm?: number;
    }[];
}

export interface StoreEnvironmentalHumidityRecordParams {
    date: string;
    items: {
        environmental_area_id: number;
        value_am?: number;
        value_pm?: number;
    }[];
}

export interface StoreEnvironmentalCleaningRecordParams {
    date: string;
    items: {
        protocol_id: number;
        is_compliant: boolean;
    }[];
}

export interface GetEnvironmentalWasteRecordsFilteredParams {
    start_date: string;
    end_date: string;
    category_id: string;
    issuer_id: string;
}

export interface GetEnvironmentalTemperatureRecordsFilteredParams {
    start_date: string;
    end_date: string;
    environmental_area_id: string;
}

export interface GetEnvironmentalHumidityRecordsFilteredParams {
    start_date: string;
    end_date: string;
    environmental_area_id: string;
}

export interface GetEnvironmentalCleaningRecordsFilteredParams {
    start_date: string;
    end_date: string;
    environmental_area_protocol_id: string;
}