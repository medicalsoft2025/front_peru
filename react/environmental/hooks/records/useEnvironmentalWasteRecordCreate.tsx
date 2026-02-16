import { useState } from "react";
import { StoreEnvironmentalWasteRecordParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalWasteRecordService } from "../../services/EnvironmentalWasteRecordService";

export const useEnvironmentalWasteRecordCreate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const createEnvironmentalWasteRecord = async (data: StoreEnvironmentalWasteRecordParams) => {
        try {
            setLoading(true)
            const response = await environmentalWasteRecordService.create(data)
            showSuccessToast({ title: 'Registro creado', message: 'El registro de residuos se ha creado correctamente' })
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
        createEnvironmentalWasteRecord,
        loading,
        toast
    };
}
