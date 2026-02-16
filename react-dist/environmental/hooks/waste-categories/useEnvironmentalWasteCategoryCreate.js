import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalWasteCategoryService } from "../../services/EnvironmentalWasteCategoryService.js";
export const useEnvironmentalWasteCategoryCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createEnvironmentalWasteCategory = async data => {
    try {
      setLoading(true);
      const response = await environmentalWasteCategoryService.create(data);
      showSuccessToast({
        title: 'Categoría de residuo creada',
        message: 'La categoría de residuo se ha creado correctamente'
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
    createEnvironmentalWasteCategory,
    loading,
    toast
  };
};