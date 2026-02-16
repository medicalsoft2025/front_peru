import { DynamicFormService } from "../services/DynamicFormService.js";
import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
export const useDynamicFormUpdate = () => {
  const dynamicFormService = new DynamicFormService();
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const updateDynamicForm = async (id, data) => {
    try {
      setLoading(true);
      const response = await dynamicFormService.update(id, data);
      showSuccessToast({
        title: 'Formulario actualizado',
        message: 'El formulario se ha actualizado correctamente'
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
    updateDynamicForm,
    loading,
    toast
  };
};