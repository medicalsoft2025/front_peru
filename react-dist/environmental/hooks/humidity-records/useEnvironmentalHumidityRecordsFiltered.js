import { useQuery } from "@tanstack/react-query";
import { environmentalHumidityRecordService } from "../../services/EnvironmentalHumidityRecordService.js";
export const useEnvironmentalHumidityRecordsFiltered = (params, options) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["environmental-humidity-records", params],
    queryFn: () => {
      return environmentalHumidityRecordService.getFiltered(params);
    },
    placeholderData: [],
    enabled: options?.enabled ?? true
  });
  return {
    humidityRecords: data,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
};