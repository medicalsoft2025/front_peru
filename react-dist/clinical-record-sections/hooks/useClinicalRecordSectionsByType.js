import { useQuery } from '@tanstack/react-query';
import { ClinicalRecordSectionsService } from "../services/ClinicalRecordSectionsService.js";
export const useClinicalRecordSectionsByType = (clinicalRecordTypeId, additionalFilters) => {
  const service = new ClinicalRecordSectionsService();
  const {
    data: sections,
    isLoading,
    isFetching,
    error,
    refetch
  } = useQuery({
    queryKey: ['clinical-record-sections', clinicalRecordTypeId.toString(), additionalFilters],
    queryFn: async () => {
      // Pass filter as expected by backend and discussed with user
      if (!clinicalRecordTypeId) return [];
      const data = await service.getFilter({
        clinical_record_type_id: clinicalRecordTypeId,
        ...additionalFilters
      });
      // Client-side sort to ensure correct order
      return data.sort((a, b) => a.order - b.order);
    },
    enabled: !!clinicalRecordTypeId
  });
  return {
    sections: sections || [],
    isLoading,
    isFetching,
    error,
    refetch
  };
};