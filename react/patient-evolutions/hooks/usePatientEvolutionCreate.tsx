import { useState } from "react";
import { evolutionNotesService } from "../../../services/api";
import { usePRToast } from "../../hooks/usePRToast";

export const usePatientEvolutionCreate = () => {

    const [loading, setLoading] = useState<boolean>(false);
    const { showSuccessToast, showServerErrorsToast } = usePRToast()

    const createPatientEvolution = async (data: any, clinicalRecordId: string) => {
        setLoading(true)
        try {
            const response = await evolutionNotesService.createEvolutionNotes(data, clinicalRecordId)
            showSuccessToast()
            return response
        } catch (error) {
            console.log(error);
            showServerErrorsToast(error)
            throw error
        } finally {
            setLoading(false)
        }
    };

    return {
        createPatientEvolution,
        loading
    };
};