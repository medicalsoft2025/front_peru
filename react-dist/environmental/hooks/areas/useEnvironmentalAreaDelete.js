import { useState } from 'react';
import { usePRToast } from "../../../hooks/usePRToast.js";
import { SwalManager } from '../../../../services/alertManagerImported.js';
import { environmentalAreaService } from "../../services/EnvironmentalAreaService.js";
export const useEnvironmentalAreaDelete = () => {
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const [loading, setLoading] = useState(false);
  const deleteEnvironmentalArea = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await environmentalAreaService.delete(id);
        confirmed = true;
      });
      showSuccessToast({
        title: 'Area eliminada',
        message: 'El area se ha eliminado correctamente'
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
    deleteEnvironmentalArea,
    loading,
    toast
  };
};