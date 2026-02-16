import { useQuery } from "@tanstack/react-query";
import { environmentalWasteCategoryService } from "../../services/EnvironmentalWasteCategoryService.js";
export const useEnvironmentalWasteCategories = () => {
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ["environmental-waste-categories"],
    queryFn: () => {
      return environmentalWasteCategoryService.getAll();
    },
    placeholderData: []
  });
  return {
    wasteCategories: data,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
};