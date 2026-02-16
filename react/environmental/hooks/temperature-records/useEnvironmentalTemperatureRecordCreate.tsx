import { useState } from "react";
import { StoreEnvironmentalTemperatureRecordParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalTemperatureRecordService } from "../../services/EnvironmentalTemperatureRecordService";
import { useQueryClient } from "@tanstack/react-query";

export const useEnvironmentalTemperatureRecordCreate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()
    const queryClient = useQueryClient()

    const createEnvironmentalTemperatureRecord = async (data: StoreEnvironmentalTemperatureRecordParams) => {
        try {
            setLoading(true)
            const response = await environmentalTemperatureRecordService.create(data)
            showSuccessToast({ title: 'Registro creado', message: 'El registro de temperatura se ha creado correctamente' })
            await queryClient.invalidateQueries({ queryKey: ['environmental-temperature-records'] })
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
