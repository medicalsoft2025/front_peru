import { UpdateDynamicFormParams } from "../interfaces/types";
import { DynamicFormService } from "../services/DynamicFormService";
import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast";

export const useDynamicFormUpdate = () => {
    const dynamicFormService = new DynamicFormService();

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const updateDynamicForm = async (id: string, data: Partial<UpdateDynamicFormParams>) => {
        try {
            setLoading(true)
            const response = await dynamicFormService.update(id, data)
            showSuccessToast({ title: 'Formulario actualizado', message: 'El formulario se ha actualizado correctamente' })
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
        updateDynamicForm,
        loading,
        toast
    };
}