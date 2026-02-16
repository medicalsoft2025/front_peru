import { useQuery } from "@tanstack/react-query";
import { clinicalRecordTypeService } from "../../../services/api";

export const useClinicalRecordType = (id: string) => {

    const {
        data: clinicalRecordType,
        isFetching,
        isLoading,
        error,
        refetch: refetchClinicalRecordType
    } = useQuery({
        queryKey: ['clinical-record-type', id.toString()],
        queryFn: () => {
            if (!id) return null;
            return clinicalRecordTypeService.get(id);
        },
    });

    return {
        clinicalRecordType,
        isFetching,
        isLoading,
        error,
        refetchClinicalRecordType
    };
}