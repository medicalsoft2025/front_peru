import { usePRToast } from "../../hooks/usePRToast";
import { useState } from "react";
import { DynamicFormValuesService } from "../services/DynamicFormValuesService";
import { useLoggedUser } from "../../users/hooks/useLoggedUser";

export const useDynamicFormValuesCreate = () => {
    const dynamicFormValuesService = new DynamicFormValuesService()

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()
    const { loggedUser } = useLoggedUser();

    const createDynamicFormValues = async (dynamic_form_id: string, data: any) => {
        try {
            setLoading(true)
            const response = await dynamicFormValuesService.create({ dynamic_form_id, values: data, user_id: loggedUser?.id })
            showSuccessToast({ title: 'Registro creado', message: 'El registro se ha creado correctamente' })
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
        createDynamicFormValues,
        loading,
        toast
    };
}