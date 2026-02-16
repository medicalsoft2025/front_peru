import { DynamicFormElementConfig } from "../../dynamic-form/interfaces/models";

export interface AppFormsFormInputs {
    name: string;
}

export interface StoreDynamicFormParams {
    config: DynamicFormElementConfig;
    name: string;
}

export interface UpdateDynamicFormParams {
    config: DynamicFormElementConfig;
    name: string;
}
