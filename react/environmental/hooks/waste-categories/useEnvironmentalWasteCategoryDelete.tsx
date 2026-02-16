import { useState } from 'react';
import { usePRToast } from '../../../hooks/usePRToast.jsx';
import { SwalManager } from '../../../../services/alertManagerImported.js';
import { environmentalWasteCategoryService } from '../../services/EnvironmentalWasteCategoryService.jsx';

export const useEnvironmentalWasteCategoryDelete = () => {
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();
    const [loading, setLoading] = useState(false);

    const deleteEnvironmentalWasteCategory = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await environmentalWasteCategoryService.delete(id);
                    confirmed = true
                }
            )
            showSuccessToast({ title: 'Categoria de residuos eliminada', message: 'La categoria de residuos se ha eliminado correctamente' })
            return confirmed
        } catch (err) {
            showServerErrorsToast(err)
            return false
        } finally {
            setLoading(false);
        }
    };

    return {
        deleteEnvironmentalWasteCategory,
        loading,
        toast
    };
};
