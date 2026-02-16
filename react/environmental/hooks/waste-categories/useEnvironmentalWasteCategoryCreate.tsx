import { useState } from "react";
import { StoreEnvironmentalWasteCategoryParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalWasteCategoryService } from "../../services/EnvironmentalWasteCategoryService";

export const useEnvironmentalWasteCategoryCreate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const createEnvironmentalWasteCategory = async (data: StoreEnvironmentalWasteCategoryParams) => {
        try {
            setLoading(true)
            const response = await environmentalWasteCategoryService.create(data)
            showSuccessToast({ title: 'Categoría de residuo creada', message: 'La categoría de residuo se ha creado correctamente' })
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
        createEnvironmentalWasteCategory,
        loading,
        toast
    };
}