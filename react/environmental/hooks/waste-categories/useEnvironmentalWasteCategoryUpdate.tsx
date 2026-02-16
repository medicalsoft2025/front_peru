import { useState } from "react";
import { StoreEnvironmentalWasteCategoryParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalWasteCategoryService } from "../../services/EnvironmentalWasteCategoryService";

export const useEnvironmentalWasteCategoryUpdate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const updateEnvironmentalWasteCategory = async (id: string, data: StoreEnvironmentalWasteCategoryParams) => {
        try {
            setLoading(true)
            const response = await environmentalWasteCategoryService.update(id, data)
            showSuccessToast({ title: 'Categoría actualizada', message: 'La categoría de residuo se ha actualizado correctamente' })
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
        updateEnvironmentalWasteCategory,
        loading,
        toast
    };
}
