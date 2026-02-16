import { useQuery } from "@tanstack/react-query"
import { environmentalCleaningRecordService } from "../../services/EnvironmentalCleaningRecordService"
import { GetEnvironmentalCleaningRecordsFilteredParams } from "../../interfaces/types"
import { EnvironmentalCleaningRecord } from "../../interfaces/models"

export const useEnvironmentalCleaningRecordsFiltered = (params: GetEnvironmentalCleaningRecordsFilteredParams, options?: { enabled?: boolean }) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery<EnvironmentalCleaningRecord[]>({
        queryKey: ["environmental-cleaning-records", params],
        queryFn: () => {
            return environmentalCleaningRecordService.getFiltered(params)
        },
        placeholderData: [],
        enabled: options?.enabled ?? true
    })

    return {
        cleaningRecords: data,
        isLoading: isLoading || isFetching,
        error,
        refetch
    }
}