import { useState } from "react";
import { FormBuilderDataMapper } from "../mappers/mappers.js";
import { useDynamicFormCreate } from "./useDynamicFormCreate.js";
import { useDynamicFormUpdate } from "./useDynamicFormUpdate.js";
import { useDynamicForm } from "./useDynamicForm.js";
import { useDynamicForms } from "./useDynamicForms.js";
import { useDynamicFormDelete } from "./useDynamicFormDelete.js";
export const useAppForms = () => {
  const [selectedForm, setSelectedForm] = useState(null);
  const {
    createDynamicForm,
    toast: toastCreate
  } = useDynamicFormCreate();
  const {
    updateDynamicForm,
    toast: toastUpdate
  } = useDynamicFormUpdate();
  const {
    deleteDynamicForm,
    toast: toastDelete
  } = useDynamicFormDelete();
  const {
    dynamicForm,
    isFetching: isFetchingForm,
    refetchForm
  } = useDynamicForm(selectedForm?.id || '');
  const {
    dynamicForms,
    isFetching: isFetchingForms,
    refetch: refetchForms
  } = useDynamicForms();
  const save = async data => {
    if (selectedForm) {
      const updateParams = FormBuilderDataMapper.toUpdateDynamicFormParams(data);
      await updateDynamicForm(selectedForm.id, updateParams);
      refetchForm();
    } else {
      const storeData = FormBuilderDataMapper.toStoreDynamicFormParams(data);
      await createDynamicForm(storeData);
    }
    refetchForms();
  };
  const remove = async data => {
    await deleteDynamicForm(data.id);
    refetchForms();
  };
  return {
    dynamicForms,
    isFetchingForms,
    refetchForms,
    dynamicForm,
    isFetchingForm,
    refetchForm,
    selectedForm,
    setSelectedForm,
    save,
    remove,
    toastCreate,
    toastUpdate,
    toastDelete
  };
};