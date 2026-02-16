import React, { useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useDynamicForm } from '../hooks/useDynamicForm';
import { useDynamicFormValuesCreate } from '../hooks/useDynamicFormValuesCreate';
import { useDynamicFormValuesUpdate } from '../hooks/useDynamicFormValuesUpdate';
import { DynamicForm, DynamicFormRef } from '../../dynamic-form/components/DynamicForm';
import { useDynamicFormValuesByForm } from '../hooks/useDynamicFormValuesByForm';

interface AppFormRendererProps {
    dynamicFormId: string;
    initialData?: any;
    onSaveSuccess?: () => void;
    onCancel?: () => void;
    showCancelButton?: boolean;
}

export const AppFormRenderer: React.FC<AppFormRendererProps> = ({
    dynamicFormId,
    initialData,
    onSaveSuccess,
    onCancel,
    showCancelButton = true
}) => {
    const { dynamicForm, isLoading, isFetching } = useDynamicForm(dynamicFormId);
    const { createDynamicFormValues, loading: isLoadingCreate, toast: toastCreate } = useDynamicFormValuesCreate();
    const { updateDynamicFormValues, loading: isLoadingUpdate, toast: toastUpdate } = useDynamicFormValuesUpdate();
    const { refetch: refetchDynamicFormValues } = useDynamicFormValuesByForm(dynamicFormId || '');

    const [isInvalid, setIsInvalid] = useState(false);
    const dynamicFormRef = useRef<DynamicFormRef>(null);
    const [formKey, setFormKey] = useState(0);

    const handleSubmit = () => {
        dynamicFormRef.current?.handleSubmit();
    };

    const onSubmit = async (data: any) => {
        let success = false;
        if (initialData?.id) {
            success = await updateDynamicFormValues(initialData.id, data);
        } else {
            success = await createDynamicFormValues(dynamicFormId, data);
        }

        if (success) {
            refetchDynamicFormValues();
            if (!initialData?.id) {
                setFormKey(prev => prev + 1);
            }
            if (onSaveSuccess) onSaveSuccess();
        }
    };

    if (isFetching || isLoading) return (
        <div className="d-flex justify-content-center align-items-center p-5">
            <div className="text-center">
                <div className="spinner-grow text-primary" role="status"></div>
                <div className="mt-2 text-muted fw-bold">Cargando formulario...</div>
            </div>
        </div>
    );

    if (!dynamicForm) return (
        <div className="alert alert-danger shadow-sm border-0 py-4 text-center">
            <h4 className="alert-heading fw-bold">Error de Configuración</h4>
            <p className="mb-0">No se pudo encontrar el formulario con ID: <strong>{dynamicFormId}</strong></p>
        </div>
    );

    return (
        <div className="app-form-renderer">
            <Toast ref={toastCreate} />
            <Toast ref={toastUpdate} />
            {dynamicForm.config && (
                <div className="mt-3">
                    <DynamicForm
                        key={formKey}
                        ref={dynamicFormRef}
                        config={dynamicForm.config}
                        data={initialData}
                        onSubmit={onSubmit}
                        onIsInvalidChange={setIsInvalid}
                        loading={isLoadingCreate || isLoadingUpdate}
                    />
                </div>
            )}

            <div className="d-flex align-items-center justify-content-end gap-2 mt-4 pt-3 border-top">
                {showCancelButton && onCancel && (
                    <Button
                        severity="secondary"
                        type="button"
                        onClick={onCancel}
                        icon={<i className='fa fa-times me-2' />}
                        label="Cancelar"
                    />
                )}
                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isInvalid || isLoadingCreate || isLoadingUpdate}
                    icon={<i className='fa fa-save me-2' />}
                    label="Guardar"
                />
            </div>
        </div>
    );
};
