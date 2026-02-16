import { useState } from "react";
import { StoreEnvironmentalHumidityRecordParams } from "../../interfaces/types";
import { usePRToast } from "../../../hooks/usePRToast";
import { environmentalHumidityRecordService } from "../../services/EnvironmentalHumidityRecordService";
import { useQueryClient } from "@tanstack/react-query";

export const useEnvironmentalHumidityRecordCreate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()
    const queryClient = useQueryClient()

    const createEnvironmentalHumidityRecord = async (data: StoreEnvironmentalHumidityRecordParams) => {
        try {
            setLoading(true)
            const response = await environmentalHumidityRecordService.create(data)
            showSuccessToast({ title: 'Registro creado', message: 'El registro de humedad se ha creado correctamente' })
            await queryClient.invalidateQueries({ queryKey: ['environmental-humidity-records'] })
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
        createEnvironmentalHumidityRecord,
        loading,
        toast
    };
}
