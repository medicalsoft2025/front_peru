import { useState } from "react";
import { StoreEnvironmentalAreaProtocolParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalAreaProtocolService } from "../../services/EnvironmentalAreaProtocolService";

export const useEnvironmentalAreaProtocolUpdate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const updateEnvironmentalAreaProtocol = async (id: string, data: StoreEnvironmentalAreaProtocolParams) => {
        try {
            setLoading(true)
            const response = await environmentalAreaProtocolService.update(id, data)
            showSuccessToast({ title: 'Protocolo actualizado', message: 'El protocolo se ha actualizado correctamente' })
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
        updateEnvironmentalAreaProtocol,
        loading,
        toast
    };
}
