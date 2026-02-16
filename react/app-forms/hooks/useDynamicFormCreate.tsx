import { usePRToast } from "../../hooks/usePRToast";
import { StoreDynamicFormParams } from "../interfaces/types";
import { DynamicFormService } from "../services/DynamicFormService";
import { useState } from "react";

export const useDynamicFormCreate = () => {
    const dynamicFormService = new DynamicFormService();

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const createDynamicForm = async (data: StoreDynamicFormParams) => {
        try {
            setLoading(true)
            const response = await dynamicFormService.create(data)
            showSuccessToast({ title: 'Formulario creado', message: 'El formulario se ha creado correctamente' })
            return response
        } catch (error) {
            console.log(error);
            showServerErrorsToast(error)
            throw error
        } finally {
            setLoading(false)
        }
    };

    return {
        createDynamicForm,
        loading,
        toast
    };
}