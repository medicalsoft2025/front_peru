import { usePRToast } from "../../hooks/usePRToast.js";
import { useState } from "react";
import SystemConfigService from "../../../services/api/classes/systemConfigService.js";
export const useSystemConfigCreate = () => {
  const systemConfigService = new SystemConfigService();
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createSystemConfig = async data => {
    try {
      setLoading(true);
      const response = await systemConfigService.storeSystemConfig({
        configs: data
      });
      showSuccessToast({
        title: 'Configuración guardada',
        message: 'La configuración se ha guardado correctamente'
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
    createSystemConfig,
    loading,
    toast
  };
};