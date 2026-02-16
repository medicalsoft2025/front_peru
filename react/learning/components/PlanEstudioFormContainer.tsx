import React from 'react';
import { useLocalStorageContext } from '../context/LocalStorageContext';
import { PlanEstudioForm } from './PlanEstudioForm';
import { PlanEstudioFormData } from '../interfaces/types';
import { usePRToast } from '../../hooks/usePRToast';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
}

export const PlanEstudioFormContainer = (props: Props) => {

    const { onCancel, onSuccess } = props;
    const formId = "planEstudioForm";

    const { selectedItem, loadingItem, saveItem } = useLocalStorageContext<PlanEstudioFormData>();
    const { toast, showSuccessToast, showServerErrorsToast } = usePRToast();

    const onSubmit = async (data: PlanEstudioFormData) => {
        try {
            await saveItem(data);
            showSuccessToast({ title: 'Éxito', message: 'Item guardado exitosamente' });
            onSuccess();
        } catch (error) {
            showServerErrorsToast(error);
        }
    }

    return (<>
        <PlanEstudioForm
            formId={formId}
            onSubmit={onSubmit}
            initialData={selectedItem || undefined}
            loadingItem={loadingItem}
        />
        <div className="d-flex justify-content-end gap-2 mt-3">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancelar
            </button>
            <button form={formId} type="submit" className="btn btn-primary">
                Guardar
            </button>
        </div>
    </>);
}