import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast.js";
import { clinicalRecordTypeService } from "../../../services/api/index.js";
export const useClinicalRecordTypeUpdate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const updateClinicalRecordType = async (id, data) => {
    try {
      setLoading(true);
      const response = await clinicalRecordTypeService.update(id, data);
      showSuccessToast({
        title: 'Tipo de historia clínica actualizado',
        message: 'El tipo de historia clínica se ha actualizado correctamente'
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
    updateClinicalRecordType,
    loading,
    toast
  };
};