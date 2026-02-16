import { useQuery } from "@tanstack/react-query"
import { environmentalTemperatureRecordService } from "../../services/EnvironmentalTemperatureRecordService"
import { GetEnvironmentalTemperatureRecordsFilteredParams } from "../../interfaces/types"
import { EnvironmentalTemperatureRecord } from "../../interfaces/models"

export const useEnvironmentalTemperatureRecordsFiltered = (params: GetEnvironmentalTemperatureRecordsFilteredParams, options?: { enabled?: boolean }) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery<EnvironmentalTemperatureRecord[]>({
        queryKey: ["environmental-temperature-records", params],
        queryFn: () => {
            return environmentalTemperatureRecordService.getFiltered(params)
        },
        placeholderData: [],
        enabled: options?.enabled ?? true
    })

    return {
        temperatureRecords: data,
        isLoading: isLoading || isFetching,
        error,
        refetch
    }
}