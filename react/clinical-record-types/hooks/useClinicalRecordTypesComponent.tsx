import { useState } from "react";
import { ClinicalRecordTypeDto } from "../interfaces/models";
import { useClinicalRecordTypeCreate } from "./useClinicalRecordTypeCreate";
import { useClinicalRecordTypeUpdate } from "./useClinicalRecordTypeUpdate";
import { useClinicalRecordType } from "./useClinicalRecordType";
import { useClinicalRecordTypes } from "./useClinicalRecordTypes";
import { useClinicalRecordTypeDelete } from "./useClinicalRecordTypeDelete";
import { ClinicalRecordTypeFormInputs } from "../interfaces/types";
import { ClinicalRecordTypeFormInputsMapper } from "../mappers/clinicalRecordTypeFormInputsMapper";

export const useClinicalRecordTypesComponent = () => {

    const [selectedItem, setSelectedItem] = useState<ClinicalRecordTypeDto | null>(null);

    const { createClinicalRecordType, loading: isLoadingCreate, toast: toastCreate } = useClinicalRecordTypeCreate();
    const { updateClinicalRecordType, loading: isLoadingUpdate, toast: toastUpdate } = useClinicalRecordTypeUpdate();
    const { deleteClinicalRecordType, loading: isLoadingDelete, toast: toastDelete } = useClinicalRecordTypeDelete();
    const { clinicalRecordType, isFetching: isFetchingClinicalRecordType, isLoading: isLoadingClinicalRecordType, refetchClinicalRecordType } = useClinicalRecordType(selectedItem?.id || '');
    const { clinicalRecordTypes, loading: isLoadingClinicalRecordTypes, fetchClinicalRecordTypes } = useClinicalRecordTypes();

    const save = async (data: ClinicalRecordTypeFormInputs) => {
        if (selectedItem) {
            const updateParams = ClinicalRecordTypeFormInputsMapper.toUpdateDynamicFormParams(data);
            await updateClinicalRecordType(selectedItem.id, updateParams);
            refetchClinicalRecordType();
        } else {
            const storeData = ClinicalRecordTypeFormInputsMapper.toStoreDynamicFormParams(data);
            await createClinicalRecordType(storeData);
        }
        fetchClinicalRecordTypes();
    };

    const remove = async (data: ClinicalRecordTypeDto) => {
        await deleteClinicalRecordType(data.id);
        fetchClinicalRecordTypes();
    };

    return {
        clinicalRecordTypes,
        isFetchingClinicalRecordType,
        isLoadingClinicalRecordTypes,
        isLoadingClinicalRecordType,
        isLoadingCreate,
        isLoadingUpdate,
        isLoadingDelete,
        clinicalRecordType,
        fetchClinicalRecordTypes,
        refetchClinicalRecordType,
        selectedItem,
        setSelectedItem,
        save,
        remove,
        toastCreate,
        toastUpdate,
        toastDelete
    };
}