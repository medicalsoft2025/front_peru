import { UpdateClinicalRecordTypeParams } from "../interfaces/types";
import { useState } from "react";
import { usePRToast } from "../../hooks/usePRToast";
import { clinicalRecordTypeService } from "../../../services/api";

export const useClinicalRecordTypeUpdate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const updateClinicalRecordType = async (id: string, data: Partial<UpdateClinicalRecordTypeParams>) => {
        try {
            setLoading(true)
            const response = await clinicalRecordTypeService.update(id, data)
            showSuccessToast({ title: 'Tipo de historia clínica actualizado', message: 'El tipo de historia clínica se ha actualizado correctamente' })
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
        updateClinicalRecordType,
        loading,
        toast
    };
}