import { clinicalRecordTypeService } from "../../../services/api/index.js";
import { useQuery } from '@tanstack/react-query';
export const useClinicalRecordTypes = () => {
  const {
    data,
    isLoading,
    isFetching,
    refetch
  } = useQuery({
    queryKey: ['clinical-record-types'],
    queryFn: () => clinicalRecordTypeService.getAll()
  });
  return {
    clinicalRecordTypes: data,
    refetch,
    loading: isLoading || isFetching
  };
};