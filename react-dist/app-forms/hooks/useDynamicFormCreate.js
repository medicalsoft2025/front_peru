import { usePRToast } from "../../hooks/usePRToast.js";
import { DynamicFormService } from "../services/DynamicFormService.js";
import { useState } from "react";
export const useDynamicFormCreate = () => {
  const dynamicFormService = new DynamicFormService();
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createDynamicForm = async data => {
    try {
      setLoading(true);
      const response = await dynamicFormService.create(data);
      showSuccessToast({
        title: 'Formulario creado',
        message: 'El formulario se ha creado correctamente'
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
    createDynamicForm,
    loading,
    toast
  };
};