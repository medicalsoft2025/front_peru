import { ClinicalRecordTypeFormInputs, StoreClinicalRecordTypeParams, UpdateClinicalRecordTypeParams } from "../interfaces/types";

export class ClinicalRecordTypeFormInputsMapper {
    static toStoreDynamicFormParams(data: ClinicalRecordTypeFormInputs): StoreClinicalRecordTypeParams {
        return {
            name: data.name,
            dynamic_form_id: data.dynamic_form_id || null
        }
    }

    static toUpdateDynamicFormParams(data: ClinicalRecordTypeFormInputs): UpdateClinicalRecordTypeParams {
        return {
            name: data.name,
            dynamic_form_id: data.dynamic_form_id || null
        }
    }
}