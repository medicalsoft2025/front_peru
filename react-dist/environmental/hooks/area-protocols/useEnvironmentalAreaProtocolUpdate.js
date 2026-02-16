import { useState } from "react";
import { usePRToast } from "../../../hooks/usePRToast.js";
import { environmentalAreaProtocolService } from "../../services/EnvironmentalAreaProtocolService.js";
export const useEnvironmentalAreaProtocolUpdate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const updateEnvironmentalAreaProtocol = async (id, data) => {
    try {
      setLoading(true);
      const response = await environmentalAreaProtocolService.update(id, data);
      showSuccessToast({
        title: 'Protocolo actualizado',
        message: 'El protocolo se ha actualizado correctamente'
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
    updateEnvironmentalAreaProtocol,
    loading,
    toast
  };
};