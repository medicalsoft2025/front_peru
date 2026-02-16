import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
import { DynamicFormValuesService } from "../services/DynamicFormValuesService.js";
export const useDynamicFormValuesUpdate = () => {
  const dynamicFormValuesService = new DynamicFormValuesService();
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const updateDynamicFormValues = async (id, data) => {
    try {
      setLoading(true);
      const response = await dynamicFormValuesService.update(id, data);
      showSuccessToast({
        title: 'Registro actualizado',
        message: 'El registro se ha actualizado correctamente'
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
    updateDynamicFormValues,
    loading,
    toast
  };
};