import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalHumidityRecordService } from "../../services/EnvironmentalHumidityRecordService.js";
export const useEnvironmentalHumidityRecordCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createEnvironmentalHumidityRecord = async data => {
    try {
      setLoading(true);
      const response = await environmentalHumidityRecordService.create(data);
      showSuccessToast({
        title: 'Registro creado',
        message: 'El registro de humedad se ha creado correctamente'
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
    createEnvironmentalHumidityRecord,
    loading,
    toast
  };
};