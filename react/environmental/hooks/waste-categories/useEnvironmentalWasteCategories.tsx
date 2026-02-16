import { useQuery } from "@tanstack/react-query"
import { environmentalWasteCategoryService } from "../../services/EnvironmentalWasteCategoryService"
import { EnvironmentalWasteCategory } from "../../interfaces/models"

export const useEnvironmentalWasteCategories = () => {
    const { data, isLoading, isFetching, error, refetch } = useQuery<EnvironmentalWasteCategory[]>({
        queryKey: ["environmental-waste-categories"],
        queryFn: () => {
            return environmentalWasteCategoryService.getAll()
        },
        placeholderData: []
    })

    return {
        wasteCategories: data,
        isLoading: isLoading || isFetching,
        error,
        refetch
    }
}