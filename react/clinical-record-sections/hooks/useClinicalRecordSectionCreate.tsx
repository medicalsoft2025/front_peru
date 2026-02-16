import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast";
import { ClinicalRecordSectionFormInputs } from "../interfaces/models";
import { ClinicalRecordSectionsService } from "../services/ClinicalRecordSectionsService";

export const useClinicalRecordSectionCreate = () => {
    const service = new ClinicalRecordSectionsService();
    const [loading, setLoading] = useState<boolean>(false);
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const createSection = async (data: ClinicalRecordSectionFormInputs) => {
        try {
            setLoading(true);
            const response = await service.create(data as any); // TS might complain if types don't match perfectly, generic casting to any or correct type
            showSuccessToast({ title: 'Sección creada', message: 'La sección se ha creado correctamente' });
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
        createSection,
        loading,
        toast
    };
};
