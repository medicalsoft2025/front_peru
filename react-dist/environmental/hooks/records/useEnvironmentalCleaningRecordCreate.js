import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalCleaningRecordService } from "../../services/EnvironmentalCleaningRecordService.js";
export const useEnvironmentalCleaningRecordCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createEnvironmentalCleaningRecord = async data => {
    try {
      setLoading(true);
      const response = await environmentalCleaningRecordService.create(data);
      showSuccessToast({
        title: 'Registro creado',
        message: 'El registro de limpieza se ha creado correctamente'
      });
      return response;
    } catch (error) {
      console.log(error);
      showServerErrorsToast(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  return {
    createEnvironmentalCleaningRecord,
    loading,
    toast
  };
};