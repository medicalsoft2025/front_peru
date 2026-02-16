import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
import { ClinicalRecordSectionsService } from "../services/ClinicalRecordSectionsService.js";
export const useClinicalRecordSectionReorder = () => {
  const service = new ClinicalRecordSectionsService();
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const reorderSections = async items => {
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