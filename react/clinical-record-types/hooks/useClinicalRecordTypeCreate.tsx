import { clinicalRecordTypeService } from "../../../services/api";
import { usePRToast } from "../../hooks/usePRToast";
import { useState } from "react";
import { StoreClinicalRecordTypeParams } from "../interfaces/types";

export const useClinicalRecordTypeCreate = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()

    const createClinicalRecordType = async (data: StoreClinicalRecordTypeParams) => {
        try {
            setLoading(true)
            const response = await clinicalRecordTypeService.create(data)
            showSuccessToast({ title: 'Tipo de historia clínica creada', message: 'El tipo de historia clínica se ha creado correctamente' })
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
        createClinicalRecordType,
        loading,
        toast
    };
}