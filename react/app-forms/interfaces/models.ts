import { DynamicFormElementConfig } from "../../dynamic-form/interfaces/models";

export interface DynamicFormModel {
    id: string;
    name: string;
    config: DynamicFormElementConfig;
    createdAt: string;
    updatedAt: string;
}