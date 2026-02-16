import { useQuery } from "@tanstack/react-query"
import { environmentalWasteRecordService } from "../../services/EnvironmentalWasteRecordService"
import { GetEnvironmentalWasteRecordsFilteredParams } from "../../interfaces/types"
import { EnvironmentalWasteRecord } from "../../interfaces/models"

export const useEnvironmentalWasteRecordsFiltered = (params: GetEnvironmentalWasteRecordsFilteredParams, options?: { enabled?: boolean }) => {
    const { data, isLoading, isFetching, error, refetch } = useQuery<EnvironmentalWasteRecord[]>({
        queryKey: ["environmental-waste-records", params],
        queryFn: () => {
            return environmentalWasteRecordService.getFiltered(params)
        },
        placeholderData: [],
        enabled: options?.enabled ?? true
    })

    return {
        wasteRecords: data,
        isLoading: isLoading || isFetching,
        error,
        refetch
    }
}