import { DynamicFormService } from "../services/DynamicFormService.js";
import { useQuery } from "@tanstack/react-query";
export const useDynamicForm = id => {
  const dynamicFormService = new DynamicFormService();
  const {
    data: dynamicForm,
    isFetching,
    isLoading,
    isRefetching,
    isPending,
    error,
    refetch: refetchForm
  } = useQuery({
    queryKey: ['dynamic-form', id.toString()],
    queryFn: () => {
      if (!id) return null;
      return dynamicFormService.get(id);
    }
  });
  return {
    dynamicForm,
    isFetching,
    isLoading: isLoading || isRefetching || isPending || isFetching,
    error,
    refetchForm
  };
};