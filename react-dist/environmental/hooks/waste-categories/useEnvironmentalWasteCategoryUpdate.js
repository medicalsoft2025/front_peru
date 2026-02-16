import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalWasteCategoryService } from "../../services/EnvironmentalWasteCategoryService.js";
export const useEnvironmentalWasteCategoryUpdate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const updateEnvironmentalWasteCategory = async (id, data) => {
    try {
      setLoading(true);
      const response = await environmentalWasteCategoryService.update(id, data);
      showSuccessToast({
        title: 'Categoría actualizada',
        message: 'La categoría de residuo se ha actualizado correctamente'
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
    updateEnvironmentalWasteCategory,
    loading,
    toast
  };
};