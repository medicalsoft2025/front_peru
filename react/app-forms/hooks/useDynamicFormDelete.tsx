import { useState } from 'react';
import { SwalManager } from '../../../services/alertManagerImported.js';
import { usePRToast } from '../../hooks/usePRToast.js';
import { DynamicFormService } from '../services/DynamicFormService.js';

export const useDynamicFormDelete = () => {
    const dynamicFormService = new DynamicFormService();
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();
    const [loading, setLoading] = useState(false);

    const deleteDynamicForm = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await dynamicFormService.delete(id);
                    confirmed = true
                }
            )
            showSuccessToast({ title: 'Formulario eliminado', message: 'El formulario se ha eliminado correctamente' })
            return confirmed
        } catch (err) {
            showServerErrorsToast(err)
            return false
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteDynamicForm,
        loading,
        toast
    };
};
