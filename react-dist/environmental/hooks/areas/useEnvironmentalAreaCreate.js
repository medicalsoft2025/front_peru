import { useState } from "react";
import { environmentalAreaService } from "../../services/EnvironmentalAreaService.js";
import { usePRToast } from "../../../hooks/usePRToast.js";
export const useEnvironmentalAreaCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createEnvironmentalArea = async data => {
    try {
      setLoading(true);
      const response = await environmentalAreaService.create(data);
      showSuccessToast({
        title: 'Área creada',
        message: 'El área se ha creado correctamente'
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
    createEnvironmentalArea,
    loading,
    toast
  };
};