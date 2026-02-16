import { useState } from 'react';
import { usePRToast } from "../../../hooks/usePRToast.js";
import { SwalManager } from '../../../../services/alertManagerImported.js';
import { environmentalAreaProtocolService } from "../../services/EnvironmentalAreaProtocolService.js";
export const useEnvironmentalAreaProtocolDelete = () => {
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const [loading, setLoading] = useState(false);
  const deleteEnvironmentalAreaProtocol = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await environmentalAreaProtocolService.delete(id);
        confirmed = true;
      });
      showSuccessToast({
        title: 'Protocolo eliminado',
        message: 'El protocolo se ha eliminado correctamente'
      });
      return confirmed;
    } catch (err) {
      showServerErrorsToast(err);
      return false;
    } finally {
      setLoading(false);
    }
  };
  return {
    deleteEnvironmentalAreaProtocol,
    loading,
    toast
  };
};