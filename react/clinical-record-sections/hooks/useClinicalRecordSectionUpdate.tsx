import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast";
import { ClinicalRecordSectionFormInputs } from "../interfaces/models";
import { ClinicalRecordSectionsService } from "../services/ClinicalRecordSectionsService";

export const useClinicalRecordSectionUpdate = () => {
    const service = new ClinicalRecordSectionsService();
    const [loading, setLoading] = useState<boolean>(false);
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const updateSection = async (id: string, data: ClinicalRecordSectionFormInputs) => {
        try {
            setLoading(true);
            const response = await service.update(id, data as any);
            showSuccessToast({ title: 'Sección actualizada', message: 'La sección se ha actualizado correctamente' });
            return response;
        } catch (error) {
            console.error(error);
            showServerErrorsToast(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        updateSection,
        loading,
        toast
    };
};
