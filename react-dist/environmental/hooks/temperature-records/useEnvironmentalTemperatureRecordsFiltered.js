import { useQuery } from "@tanstack/react-query";
import { environmentalTemperatureRecordService } from "../../services/EnvironmentalTemperatureRecordService.js";
export const useEnvironmentalTemperatureRecordsFiltered = (params, options) => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["environmental-temperature-records", params],
    queryFn: () => {
      return environmentalTemperatureRecordService.getFiltered(params);
    },
    placeholderData: [],
    enabled: options?.enabled ?? true
  });
  return {
    temperatureRecords: data,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
};