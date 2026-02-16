import { useState } from "react";
import { useClinicalRecordTypeCreate } from "./useClinicalRecordTypeCreate.js";
import { useClinicalRecordTypeUpdate } from "./useClinicalRecordTypeUpdate.js";
import { useClinicalRecordType } from "./useClinicalRecordType.js";
import { useClinicalRecordTypes } from "./useClinicalRecordTypes.js";
import { useClinicalRecordTypeDelete } from "./useClinicalRecordTypeDelete.js";
import { ClinicalRecordTypeFormInputsMapper } from "../mappers/clinicalRecordTypeFormInputsMapper.js";
export const useClinicalRecordTypesComponent = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const {
    createClinicalRecordType,
    loading: isLoadingCreate,
    toast: toastCreate
  } = useClinicalRecordTypeCreate();
  const {
    updateClinicalRecordType,
    loading: isLoadingUpdate,
    toast: toastUpdate
  } = useClinicalRecordTypeUpdate();
  const {
    deleteClinicalRecordType,
    loading: isLoadingDelete,
    toast: toastDelete
  } = useClinicalRecordTypeDelete();
  const {
    clinicalRecordType,
    isFetching: isFetchingClinicalRecordType,
    isLoading: isLoadingClinicalRecordType,
    refetchClinicalRecordType
  } = useClinicalRecordType(selectedItem?.id || '');
  const {
    clinicalRecordTypes,
    loading: isLoadingClinicalRecordTypes,
    fetchClinicalRecordTypes
  } = useClinicalRecordTypes();
  const save = async data => {
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
  const remove = async data => {
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
};