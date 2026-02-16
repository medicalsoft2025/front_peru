import React, { useEffect } from 'react';
import { AppFormsFormDialog } from './AppFormsFormDialog';
import { Button } from 'primereact/button';
import { AppFormsTable } from './AppFormsTable';
import { FormBuilderData } from '../../form-builder/interfaces/types';
import { DynamicFormMapper } from '../mappers/mappers';
import { DynamicFormModel } from '../interfaces/models';
import { Toast } from 'primereact/toast';
import { useAppForms } from '../hooks/useAppForms';

export const AppForms = () => {

    const [showFormDialog, setShowFormDialog] = React.useState(false);
    const [initialData, setInitialData] = React.useState<FormBuilderData | null>(null);

    const {
        save,
        remove,
        toastCreate,
        toastUpdate,
        toastDelete,
        dynamicForms,
        isFetchingForms,
        dynamicForm,
        isFetchingForm,
        setSelectedForm,
        refetchForms
    } = useAppForms();

    const onCreate = () => {
        setSelectedForm(null);
        setInitialData(null);
        setShowFormDialog(true);
    };

    const onEdit = (data: DynamicFormModel) => {
        setSelectedForm(data);
        setShowFormDialog(true);
    };

    const onHide = () => {
        setShowFormDialog(false);
        setSelectedForm(null);
    };

    useEffect(() => {
        if (dynamicForm && dynamicForm.id) {
            setInitialData(DynamicFormMapper.toFormBuilderData(dynamicForm));
        }
    }, [dynamicForm]);

    return (<>
        <Toast ref={toastCreate} />
        <Toast ref={toastUpdate} />
        <Toast ref={toastDelete} />
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Formularios</h2>
                <Button
                    label="Nuevo Formulario"
                    icon={<i className="fa fa-plus me-1" />}
                    onClick={onCreate}
                />
            </div>
            <AppFormsTable
                data={dynamicForms || []}
                onEdit={onEdit}
                onDelete={remove}
                loading={isFetchingForms}
                onReload={refetchForms}
            />
            <AppFormsFormDialog
                visible={showFormDialog}
                onHide={onHide}
                onSubmit={save}
                initialData={initialData}
                loading={isFetchingForm}
            />
        </div>
    </>);
};