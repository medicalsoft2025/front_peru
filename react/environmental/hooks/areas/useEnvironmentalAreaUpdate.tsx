import { useState } from "react";
import { StoreEnvironmentalAreaParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalAreaService } from "../../services/EnvironmentalAreaService";

export const useEnvironmentalAreaUpdate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const updateEnvironmentalArea = async (id: string, data: StoreEnvironmentalAreaParams) => {
        try {
            setLoading(true)
            const response = await environmentalAreaService.update(id, data)
            showSuccessToast({ title: 'Area actualizada', message: 'El área se ha actualizado correctamente' })
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
        updateEnvironmentalArea,
        loading,
        toast
    };
}
