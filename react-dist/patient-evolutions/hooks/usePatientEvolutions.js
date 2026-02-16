import { useMemo, useState } from "react";
import { evolutionNotesService } from "../../../services/api/index.js";
import { usePaginatedQuery } from "../../hooks/usePaginatedQuery.js";
export const usePatientEvolutions = props => {
  const {
    patientId,
    clinicalRecordId,
    filters
  } = props;
  const [totalRecords, setTotalRecords] = useState(0);
  const normalizedFilters = useMemo(() => ({
    ...filters,
    rangeDate: filters.rangeDate?.map(date => date?.toISOString().split("T")[0])
  }), [filters]);
  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    handlePageChange,
    handleSearchChange,
    first,
    perPage
  } = usePaginatedQuery({
    queryKey: ["patient-evolutions", patientId, clinicalRecordId, normalizedFilters],
    queryFn: async paginationParams => {
      const {
        page,
        perPage,
        search
      } = paginationParams;
      const response = await evolutionNotesService.filterEvolutionNotes({
        per_page: perPage,
        page: page,
        search: search || "",
        startDate: normalizedFilters.rangeDate?.[0],
        endDate: normalizedFilters.rangeDate?.[1],
        user_id: normalizedFilters.user_id,
        patient_id: patientId,
        clinicalRecordTypeId: normalizedFilters.clinicalRecordTypeId,
        clinicalRecordId: clinicalRecordId
      });
      setTotalRecords(response.data.total || 0);
      return response.data.data;
    }
  });
  return {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    handlePageChange,
    handleSearchChange,
    totalRecords,
    first,
    perPage
  };
};