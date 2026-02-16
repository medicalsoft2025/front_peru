import { useState } from 'react';
import { SwalManager } from '../../../services/alertManagerImported.js';
import { usePRToast } from '../../hooks/usePRToast.js';
import { clinicalRecordTypeService } from '../../../services/api/index.js';
export const useClinicalRecordTypeDelete = () => {
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const [loading, setLoading] = useState(false);
  const deleteClinicalRecordType = async id => {
    let confirmed = false;
    try {
      await SwalManager.confirmDelete(async () => {
        setLoading(true);
        await clinicalRecordTypeService.delete(id);
        confirmed = true;
      });
      showSuccessToast({
        title: 'Tipo de historia clínica eliminado',
        message: 'El tipo de historia clínica se ha eliminado correctamente'
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
    deleteClinicalRecordType,
    loading,
    toast
  };
};