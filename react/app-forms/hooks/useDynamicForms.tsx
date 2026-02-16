import { DynamicFormModel } from "../interfaces/models";
import { DynamicFormService } from "../services/DynamicFormService";
import { useQuery } from "@tanstack/react-query";

export const useDynamicForms = () => {
    const dynamicFormService = new DynamicFormService();

    const {
        data: dynamicForms,
        isFetching,
        isLoading,
        error,
        refetch
    } = useQuery<DynamicFormModel[]>({
        queryKey: ["dynamic-forms"],
        queryFn: () => dynamicFormService.getAll(),
    });

    return {
        dynamicForms,
        isLoading,
        isFetching,
        error,
        refetch
    };
}