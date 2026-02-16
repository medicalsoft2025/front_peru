import { useState } from "react";
import { evolutionNotesService } from "../../../services/api/index.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const usePatientEvolutionCreate = () => {
  const [loading, setLoading] = useState(false);
  const {
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const createPatientEvolution = async (data, clinicalRecordId) => {
    setLoading(true);
    try {
      const response = await evolutionNotesService.createEvolutionNotes(data, clinicalRecordId);
      showSuccessToast();
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
    createPatientEvolution,
    loading
  };
};