import { useState } from "react";
import { StoreEnvironmentalAreaParams } from "../../interfaces/types";
import { environmentalAreaService } from "../../services/EnvironmentalAreaService";
import { usePRToast } from "../../../hooks/usePRToast";

export const useEnvironmentalAreaCreate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const createEnvironmentalArea = async (data: StoreEnvironmentalAreaParams) => {
        try {
            setLoading(true)
            const response = await environmentalAreaService.create(data)
            showSuccessToast({ title: 'Área creada', message: 'El área se ha creado correctamente' })
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
        createEnvironmentalArea,
        loading,
        toast
    };
}