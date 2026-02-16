import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast";
import { DynamicFormValuesService } from "../services/DynamicFormValuesService";

export const useDynamicFormValuesUpdate = () => {
    const dynamicFormValuesService = new DynamicFormValuesService()

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const updateDynamicFormValues = async (id: string, data: any) => {
        try {
            setLoading(true)
            const response = await dynamicFormValuesService.update(id, data)
            showSuccessToast({ title: 'Registro actualizado', message: 'El registro se ha actualizado correctamente' })
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
        updateDynamicFormValues,
        loading,
        toast
    };
}