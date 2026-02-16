import { useQuery } from "@tanstack/react-query";
import { environmentalAreaService } from "../../services/EnvironmentalAreaService.js";
export const useEnvironmentalAreaProtocols = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["environmental-area-protocols"],
    queryFn: () => {
      return environmentalAreaService.getAreaProtocols();
    },
    placeholderData: []
  });
  return {
    areaProtocols: data,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
};