import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
import { ClinicalRecordSectionsService } from "../services/ClinicalRecordSectionsService.js";
export const useClinicalRecordSectionUpdate = () => {
  const service = new ClinicalRecordSectionsService();
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const updateSection = async (id, data) => {
    try {
      setLoading(true);
      const response = await service.update(id, data);
      showSuccessToast({
        title: 'Sección actualizada',
        message: 'La sección se ha actualizado correctamente'
      });
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