import { useState } from "react";
import { StoreEnvironmentalTemperatureRecordParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalTemperatureRecordService } from "../../services/EnvironmentalTemperatureRecordService";

export const useEnvironmentalTemperatureRecordCreate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const createEnvironmentalTemperatureRecord = async (data: StoreEnvironmentalTemperatureRecordParams) => {
        try {
            setLoading(true)
            const response = await environmentalTemperatureRecordService.create(data)
            showSuccessToast({ title: 'Registro creado', message: 'El registro de temperatura se ha creado correctamente' })
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
        createEnvironmentalTemperatureRecord,
        loading,
        toast
    };
}
