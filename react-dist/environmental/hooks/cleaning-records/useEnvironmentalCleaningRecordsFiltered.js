import { useQuery } from "@tanstack/react-query";
import { environmentalCleaningRecordService } from "../../services/EnvironmentalCleaningRecordService.js";
export const useEnvironmentalCleaningRecordsFiltered = (params, options) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["environmental-cleaning-records", params],
    queryFn: () => {
      return environmentalCleaningRecordService.getFiltered(params);
    },
    placeholderData: [],
    enabled: options?.enabled ?? true
  });
  return {
    cleaningRecords: data,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
};