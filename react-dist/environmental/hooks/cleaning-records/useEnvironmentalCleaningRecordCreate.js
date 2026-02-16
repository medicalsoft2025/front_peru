import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalCleaningRecordService } from "../../services/EnvironmentalCleaningRecordService.js";
import { useQueryClient } from "@tanstack/react-query";
export const useEnvironmentalCleaningRecordCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const queryClient = useQueryClient();
  const createEnvironmentalCleaningRecord = async data => {
    try {
      setLoading(true);
      const response = await environmentalCleaningRecordService.create(data);
      showSuccessToast({
        title: 'Registro creado',
        message: 'El registro de limpieza se ha creado correctamente'
      });
      await queryClient.invalidateQueries({
        queryKey: ['environmental-cleaning-records']
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