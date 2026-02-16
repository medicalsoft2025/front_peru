import { useQuery } from "@tanstack/react-query";
import { DynamicFormValuesService } from "../services/DynamicFormValuesService.js";
export const useDynamicFormValuesByForm = dynamicFormId => {
  const dynamicFormValuesService = new DynamicFormValuesService();
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['dynamic-form-values', dynamicFormId],
    queryFn: () => dynamicFormValuesService.byDynamicForm(dynamicFormId)
  });
  return {
    data,
    isLoading: isLoading || isFetching,
    refetch
  };
};