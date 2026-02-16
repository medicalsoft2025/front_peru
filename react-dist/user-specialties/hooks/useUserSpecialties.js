import { userSpecialtyService } from "../../../services/api/index.js";
import { ErrorHandler } from "../../../services/errorHandler.js";
import { useQuery } from '@tanstack/react-query';
export const useUserSpecialties = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['userSpecialties'],
    queryFn: () => fetchUserSpecialties(),
    placeholderData: []
  });
  const fetchUserSpecialties = async () => {
    try {
      const data = await userSpecialtyService.getAll();
      const mappedData = data.map(item => {
        return {
          ...item,
          label: item.name
        };
      });
      return mappedData;
    } catch (err) {
      ErrorHandler.generic(err);
    }
  };
  return {
    userSpecialties: data,
    fetchUserSpecialties: refetch,
    loading: isLoading || isFetching
  };
};