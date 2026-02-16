import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalWasteRecordService } from "../../services/EnvironmentalWasteRecordService.js";
export const useEnvironmentalWasteRecordCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const queryClient = useQueryClient();
  const createEnvironmentalWasteRecord = async data => {
    try {
      setLoading(true);
      const response = await environmentalWasteRecordService.create(data);
      showSuccessToast({
        title: 'Registro creado',
        message: 'El registro de residuos se ha creado correctamente'
      });
      await queryClient.invalidateQueries({
        queryKey: ['environmental-waste-records']
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
    createEnvironmentalWasteRecord,
    loading,
    toast
  };
};