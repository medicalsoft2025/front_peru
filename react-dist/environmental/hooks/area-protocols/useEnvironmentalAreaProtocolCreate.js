import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalAreaProtocolService } from "../../services/EnvironmentalAreaProtocolService.js";
export const useEnvironmentalAreaProtocolCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createEnvironmentalAreaProtocol = async data => {
    try {
      setLoading(true);
      const response = await environmentalAreaProtocolService.create(data);
      showSuccessToast({
        title: 'Protocolo creado',
        message: 'El protocolo se ha creado correctamente'
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
    createEnvironmentalAreaProtocol,
    loading,
    toast
  };
};