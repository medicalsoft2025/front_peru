import { useQuery } from "@tanstack/react-query";
import { thirdPartyService } from "../../../services/api";

export const usePatientThirdParty = (id: string) => {

    const {
        data: patientThirdParty,
        isFetching,
        isLoading,
        error,
        refetch: refetchPatientThirdParty
    } = useQuery({
        queryKey: ['patient-third-party', id.toString()],
        queryFn: () => {
            if (!id) return null;
            return thirdPartyService.getByExternalIdAndType({
                externalId: id,
                externalType: "client"
            });
        },
    });

    return {
        patientThirdParty,
        isFetching,
        isLoading,
        error,
        refetchPatientThirdParty
    };
}