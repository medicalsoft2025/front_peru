import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
import { ClinicalRecordSectionsService } from "../services/ClinicalRecordSectionsService.js";
export const useClinicalRecordSectionCreate = () => {
  const service = new ClinicalRecordSectionsService();
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createSection = async data => {
    try {
      setLoading(true);
      const response = await service.create(data); // TS might complain if types don't match perfectly, generic casting to any or correct type
      showSuccessToast({
        title: 'Sección creada',
        message: 'La sección se ha creado correctamente'
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
    createSection,
    loading,
    toast
  };
};