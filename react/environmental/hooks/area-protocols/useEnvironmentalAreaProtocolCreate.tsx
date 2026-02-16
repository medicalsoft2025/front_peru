import { useState } from "react";
import { StoreEnvironmentalAreaProtocolParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalAreaProtocolService } from "../../services/EnvironmentalAreaProtocolService";

export const useEnvironmentalAreaProtocolCreate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const createEnvironmentalAreaProtocol = async (data: StoreEnvironmentalAreaProtocolParams) => {
        try {
            setLoading(true)
            const response = await environmentalAreaProtocolService.create(data)
            showSuccessToast({ title: 'Protocolo creado', message: 'El protocolo se ha creado correctamente' })
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
        createEnvironmentalAreaProtocol,
        loading,
        toast
    };
}