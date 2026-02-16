import React from 'react';
import { Dialog } from 'primereact/dialog';
import { ClinicalRecordTypesForm } from './ClinicalRecordTypesForm';
import { ClinicalRecordTypeFormInputs } from '../interfaces/types';
import { Button } from 'primereact/button';

interface ClinicalRecordTypesFormDialogProps {
    visible: boolean;
    initialData?: ClinicalRecordTypeFormInputs | null;
    loading: boolean;
    onHide: () => void;
    onSubmit: (data: ClinicalRecordTypeFormInputs) => void;
}

export const ClinicalRecordTypesFormDialog = (props: ClinicalRecordTypesFormDialogProps) => {

    const formId = "clinical-record-types-form";

    const { visible, initialData, onHide, onSubmit, loading } = props;

    return (
        <Dialog
            header="Crear Formulario"
            visible={visible}
            onHide={onHide}
            style={{
                width: '75vw',
            }}
            draggable={false}
            resizable={false}
            maximizable
            footer={
                <div className="d-flex justify-content-end gap-2">
                    <Button
                        label="Cancelar"
                        icon={<i className="fa fa-times me-1" />}
                        severity='secondary'
                        onClick={onHide}
                    />
                    <Button
                        label="Guardar"
                        icon={<i className="fa fa-save me-1" />}
                        form={formId}
                        type="submit"
                        disabled={loading}
                    />
                </div>
            }
        >
            <ClinicalRecordTypesForm
                formId={formId}
                onSubmit={onSubmit}
                initialData={initialData}
            />
        </Dialog>
    );
};