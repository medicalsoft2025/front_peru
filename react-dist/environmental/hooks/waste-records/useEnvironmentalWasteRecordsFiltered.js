import { useQuery } from "@tanstack/react-query";
import { environmentalWasteRecordService } from "../../services/EnvironmentalWasteRecordService.js";
export const useEnvironmentalWasteRecordsFiltered = (params, options) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["environmental-waste-records", params],
    queryFn: () => {
      return environmentalWasteRecordService.getFiltered(params);
    },
    placeholderData: [],
    enabled: options?.enabled ?? true
  });
  return {
    wasteRecords: data,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
};