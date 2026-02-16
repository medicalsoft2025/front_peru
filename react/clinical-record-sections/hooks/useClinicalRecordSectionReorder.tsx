import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast";
import { ClinicalRecordSectionsService } from "../services/ClinicalRecordSectionsService";

export const useClinicalRecordSectionReorder = () => {
    const service = new ClinicalRecordSectionsService();
    const [loading, setLoading] = useState<boolean>(false);
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const reorderSections = async (items: { id: number, order: number }[]) => {
        try {
            setLoading(true);
            const response = await service.reorder(items);
            // Optional: Toast for reorder success might handle by caller or here
            // showSuccessToast({ title: 'Orden actualizado', message: 'El orden de las secciones se ha guardado.' });
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
        reorderSections,
        loading,
        toast
    };
};
