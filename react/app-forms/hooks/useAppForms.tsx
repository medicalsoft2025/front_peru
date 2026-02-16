import { useState } from "react";
import { FormBuilderData } from "../../form-builder/interfaces/types";
import { DynamicFormModel } from "../interfaces/models";
import { FormBuilderDataMapper } from "../mappers/mappers";
import { useDynamicFormCreate } from "./useDynamicFormCreate";
import { useDynamicFormUpdate } from "./useDynamicFormUpdate";
import { useDynamicForm } from "./useDynamicForm";
import { useDynamicForms } from "./useDynamicForms";
import { useDynamicFormDelete } from "./useDynamicFormDelete";

export const useAppForms = () => {

    const [selectedForm, setSelectedForm] = useState<DynamicFormModel | null>(null);

    const { createDynamicForm, toast: toastCreate } = useDynamicFormCreate();
    const { updateDynamicForm, toast: toastUpdate } = useDynamicFormUpdate();
    const { deleteDynamicForm, toast: toastDelete } = useDynamicFormDelete();
    const { dynamicForm, isFetching: isFetchingForm, refetchForm } = useDynamicForm(selectedForm?.id || '');
    const { dynamicForms, isFetching: isFetchingForms, refetch: refetchForms } = useDynamicForms();

    const save = async (data: FormBuilderData) => {
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

    const remove = async (data: DynamicFormModel) => {
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
}