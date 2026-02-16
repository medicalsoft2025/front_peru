export interface ClinicalRecordSection {
    id: string;
    clinical_record_type_id: string;
    dynamic_form_id: string;
    dynamic_form?: {
        id: string;
        name: string;
    };
    type: string;
    label: string | null;
    order: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
}

export interface ClinicalRecordSectionFormInputs {
    id?: string;
    clinical_record_type_id: string;
    dynamic_form_id: string | null;
    type: string;
    label: string;
    order?: number;
}
