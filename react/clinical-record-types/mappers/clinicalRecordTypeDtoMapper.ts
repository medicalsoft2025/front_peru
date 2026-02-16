import { ClinicalRecordTypeDto } from "../interfaces/models";
import { ClinicalRecordTypeFormInputs } from "../interfaces/types";

export const ClinicalRecordTypeDtoMapper = {
    toFormBuilderData: (data: ClinicalRecordTypeDto): ClinicalRecordTypeFormInputs => {
        console.log("data", data);
        return {
            name: data.name,
            dynamic_form_id: data.dynamic_form_id
        };
    }
};

