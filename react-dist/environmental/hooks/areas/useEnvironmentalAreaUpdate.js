import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalAreaService } from "../../services/EnvironmentalAreaService.js";
export const useEnvironmentalAreaUpdate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const updateEnvironmentalArea = async (id, data) => {
    try {
      setLoading(true);
      const response = await environmentalAreaService.update(id, data);
      showSuccessToast({
        title: 'Area actualizada',
        message: 'El área se ha actualizado correctamente'
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
    updateEnvironmentalArea,
    loading,
    toast
  };
};