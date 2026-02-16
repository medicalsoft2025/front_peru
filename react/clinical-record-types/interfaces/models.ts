export interface ClinicalRecordTypeDto {
    id: string;
    name: string;
    description: string;
    form_config: any;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    key_: string | null;
    dynamic_form_id: string;
}