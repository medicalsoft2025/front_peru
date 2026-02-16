import React from 'react';
import { Dialog } from 'primereact/dialog';
import { FormBuilder } from '../../form-builder/components/FormBuilder';
import { DynamicFormElementConfig } from '../../dynamic-form/interfaces/models';
import { FormBuilderData } from '../../form-builder/interfaces/types';

interface AppFormsFormDialogProps {
    visible: boolean;
    initialData?: FormBuilderData | null;
    loading?: boolean;
    onHide: () => void;
    onSubmit: (data: {
        config: DynamicFormElementConfig,
        configName: string
    }) => void;
}

export const AppFormsFormDialog = (props: AppFormsFormDialogProps) => {

    const { visible, initialData, onHide, onSubmit, loading = false } = props;

    console.log("initialData", initialData);

    return (
        <Dialog
            header="Crear Formulario"
            visible={visible}
            onHide={onHide}
            style={{
                width: '100vw',
                height: '100vh',
                maxHeight: '100vh',
                maxWidth: '100vw'
            }}
            draggable={false}
            resizable={false}
            maximizable
            pt={{
                root: {
                    style: {
                        width: '100vw',
                        height: '100vh',
                        maxHeight: '100vh',
                        maxWidth: '100vw'
                    }
                }
            }}
        >
            <FormBuilder onSubmit={onSubmit} initialData={initialData} loading={loading} />
        </Dialog>
    );
};