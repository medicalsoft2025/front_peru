import { clinicalRecordTypeService } from "../../../services/api/index.js";
import { usePRToast } from "../../hooks/usePRToast.js";
import { useState } from "react";
export const useClinicalRecordTypeCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const createClinicalRecordType = async data => {
    try {
      setLoading(true);
      const response = await clinicalRecordTypeService.create(data);
      showSuccessToast({
        title: 'Tipo de historia clínica creada',
        message: 'El tipo de historia clínica se ha creado correctamente'
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
    createClinicalRecordType,
    loading,
    toast
  };
};