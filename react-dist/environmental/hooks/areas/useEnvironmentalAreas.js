import { useQuery } from "@tanstack/react-query";
import { environmentalAreaService } from "../../services/EnvironmentalAreaService.js";
export const useEnvironmentalAreas = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["environmental-areas"],
    queryFn: () => {
      return environmentalAreaService.getAll();
    },
    placeholderData: []
  });
  return {
    areas: data,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
};