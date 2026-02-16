import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ClinicalRecordTypeFormInputs } from '../interfaces/types';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { useDynamicForms } from '../../app-forms/hooks/useDynamicForms';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DynamicForm } from '../../dynamic-form/components/DynamicForm';
import { AppFormsFormDialog } from '../../app-forms/components/AppFormsFormDialog';
import { useAppForms } from '../../app-forms/hooks/useAppForms';
import { Toast } from 'primereact/toast';

interface ClinicalRecordTypesFormProps {
    formId: string;
    onSubmit: (data: ClinicalRecordTypeFormInputs) => void;
    initialData?: ClinicalRecordTypeFormInputs | null;
}

export const ClinicalRecordTypesForm = (props: ClinicalRecordTypesFormProps) => {

    const { formId, onSubmit, initialData } = props;

    const defaultValues: ClinicalRecordTypeFormInputs = {
        name: "",
        dynamic_form_id: null
    };

    const [showFormPreviewDialog, setShowFormPreviewDialog] = useState(false);
    const [showFormEditorDialog, setShowFormEditorDialog] = useState(false);

    const { handleSubmit, control, reset, formState: { errors } } = useForm<ClinicalRecordTypeFormInputs>({
        defaultValues: initialData || defaultValues,
        mode: "onChange"
    });

    const { dynamicForms } = useDynamicForms();

    const dynamicFormId = useWatch({
        control,
        name: "dynamic_form_id"
    });

    const dynamicForm = dynamicForms?.find((form) => form.id == dynamicFormId);

    const { save, isFetchingForm: isLoadingForm, toastCreate: toastCreateForm } = useAppForms();

    const getFormErrorMessage = (name: keyof ClinicalRecordTypeFormInputs) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        );
    };

    useEffect(() => {
        reset(initialData || defaultValues);
    }, [initialData]);

    return (<>
        <Toast ref={toastCreateForm} />
        <form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <div className="d-flex flex-column mb-3">
                <Controller
                    name="name"
                    control={control}
                    rules={{ required: "El nombre es requerido" }}
                    render={({ field }) => (<>
                        <label htmlFor="name" className="form-label">Nombre *</label>
                        <InputText id="name" {...field} className="w-100" />
                    </>)}
                />
                {getFormErrorMessage("name")}
            </div>
            <div className="d-flex flex-column">
                <Controller
                    name="dynamic_form_id"
                    control={control}
                    rules={{ required: "El formulario dinámico es requerido" }}
                    render={({ field }) => (<>
                        <div className="d-flex align-items-end gap-1">
                            <div className="d-flex flex-column flex-grow-1">
                                <label htmlFor="dynamic_form_id" className="form-label">Formulario dinámico *</label>
                                <Dropdown
                                    id="dynamic_form_id"
                                    inputId="dynamic_form_id"
                                    {...field}
                                    options={dynamicForms}
                                    optionLabel="name"
                                    optionValue="id"
                                    placeholder="Seleccionar"
                                    className="w-100"
                                />
                            </div>
                            <div className="d-flex gap-1">
                                <Button
                                    icon={<i className="fa fa-plus" />}
                                    type="button"
                                    onClick={() => { setShowFormEditorDialog(true) }}
                                />
                                <Button
                                    icon={<i className="fa fa-eye" />}
                                    type="button"
                                    disabled={!dynamicForm}
                                    onClick={() => { setShowFormPreviewDialog(true) }}
                                />
                            </div>
                        </div>
                    </>)}
                />
                {getFormErrorMessage("dynamic_form_id")}
            </div>
        </form>

        <Dialog
            visible={showFormPreviewDialog}
            onHide={() => setShowFormPreviewDialog(false)}
            header={`Previsualizar Formulario | ${dynamicForm?.name}`}
            style={{ width: '100vw' }}
            maximizable
        >
            {dynamicForm && (
                <DynamicForm
                    config={dynamicForm?.config || {}}
                    onSubmit={() => { }}
                />
            )}
        </Dialog>

        <AppFormsFormDialog
            visible={showFormEditorDialog}
            onHide={() => setShowFormEditorDialog(false)}
            onSubmit={save}
            loading={isLoadingForm}
        />
    </>);
}