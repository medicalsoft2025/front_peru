import { useState } from 'react';
import { SwalManager } from '../../../services/alertManagerImported.js';
import { usePRToast } from '../../hooks/usePRToast.js';
import { ClinicalRecordSectionsService } from "../services/ClinicalRecordSectionsService.js";
export const useClinicalRecordSectionDelete = () => {
  const service = new ClinicalRecordSectionsService();
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const [loading, setLoading] = useState(false);
  const deleteClinicalRecordSection = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await service.delete(id);
        confirmed = true;
      });
      showSuccessToast({
        title: 'Sección eliminada',
        message: 'La sección se ha eliminado correctamente'
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
    deleteClinicalRecordSection,
    loading,
    toast
  };
};