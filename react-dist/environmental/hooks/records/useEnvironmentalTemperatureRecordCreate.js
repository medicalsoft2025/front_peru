import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalTemperatureRecordService } from "../../services/EnvironmentalTemperatureRecordService.js";
export const useEnvironmentalTemperatureRecordCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createEnvironmentalTemperatureRecord = async data => {
    try {
      setLoading(true);
      const response = await environmentalTemperatureRecordService.create(data);
      showSuccessToast({
        title: 'Registro creado',
        message: 'El registro de temperatura se ha creado correctamente'
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
    createEnvironmentalTemperatureRecord,
    loading,
    toast
  };
};