import { useQuery } from "@tanstack/react-query"
import { environmentalHumidityRecordService } from "../../services/EnvironmentalHumidityRecordService"
import { GetEnvironmentalHumidityRecordsFilteredParams } from "../../interfaces/types"
import { EnvironmentalHumidityRecord } from "../../interfaces/models"

export const useEnvironmentalHumidityRecordsFiltered = (params: GetEnvironmentalHumidityRecordsFilteredParams, options?: { enabled?: boolean }) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery<EnvironmentalHumidityRecord[]>({
        queryKey: ["environmental-humidity-records", params],
        queryFn: () => {
            return environmentalHumidityRecordService.getFiltered(params)
        },
        placeholderData: [],
        enabled: options?.enabled ?? true
    })

    return {
        humidityRecords: data,
        isLoading: isLoading || isFetching,
        error,
        refetch
    }
}