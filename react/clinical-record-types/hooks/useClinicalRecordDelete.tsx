import { useState } from 'react';
import { SwalManager } from '../../../services/alertManagerImported.js';
import { usePRToast } from '../../hooks/usePRToast.js';
import { clinicalRecordTypeService } from '../../../services/api';

export const useClinicalRecordDelete = () => {
    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();
    const [loading, setLoading] = useState(false);

    const deleteClinicalRecordType = async (id: string) => {
        let confirmed = false
        try {
            await SwalManager.confirmDelete(
                async () => {
                    setLoading(true);
                    await clinicalRecordTypeService.delete(id);
                    confirmed = true
                }
            )
            showSuccessToast({ title: 'Tipo de historia clínica eliminado', message: 'El tipo de historia clínica se ha eliminado correctamente' })
            return confirmed
        } catch (err) {
            showServerErrorsToast(err)
            return false
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
