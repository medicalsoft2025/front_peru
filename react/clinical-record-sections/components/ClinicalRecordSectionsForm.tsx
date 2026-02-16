import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { ClinicalRecordSectionFormInputs } from '../interfaces/models';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useDynamicForms } from '../../app-forms/hooks/useDynamicForms';
import { useAppForms } from '../../app-forms/hooks/useAppForms';
import { AppFormsFormDialog } from '../../app-forms/components/AppFormsFormDialog';
import { DynamicForm } from '../../dynamic-form/components/DynamicForm';
import { Toast } from 'primereact/toast';

interface ClinicalRecordSectionsFormProps {
    formId: string;
    onSubmit: (data: ClinicalRecordSectionFormInputs) => void;
    initialData?: ClinicalRecordSectionFormInputs | null;
    clinicalRecordTypeId: string;
}

export const ClinicalRecordSectionsForm = (props: ClinicalRecordSectionsFormProps) => {
    const { formId, onSubmit, initialData, clinicalRecordTypeId } = props;

    const defaultValues: ClinicalRecordSectionFormInputs = {
        clinical_record_type_id: clinicalRecordTypeId,
        dynamic_form_id: null,
        type: 'finish_modal_tab',
        label: '',
        order: 0
    };

    const [showFormPreviewDialog, setShowFormPreviewDialog] = useState(false);
    const [showFormEditorDialog, setShowFormEditorDialog] = useState(false);

    const { handleSubmit, control, reset, formState: { errors }, setValue } = useForm<ClinicalRecordSectionFormInputs>({
        defaultValues: initialData || defaultValues,
        mode: "onChange"
    });

    const { dynamicForms } = useDynamicForms();
    const { save, isFetchingForm: isLoadingForm, toastCreate: toastCreateForm } = useAppForms();

    const dynamicFormId = useWatch({
        control,
        name: "dynamic_form_id"
    });

    const dynamicForm = dynamicForms?.find((form) => form.id == dynamicFormId);

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({ ...defaultValues, clinical_record_type_id: clinicalRecordTypeId });
        }
    }, [initialData, clinicalRecordTypeId, reset]);

    const getFormErrorMessage = (name: keyof ClinicalRecordSectionFormInputs) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        );
    };

    const typeOptions = [
        { label: 'Tab en ventana de finalizar consulta', value: 'finish_modal_tab' }
    ];

    return (<>
        <Toast ref={toastCreateForm} />
        <form onSubmit={handleSubmit(onSubmit)} id={formId}>
            {/* Hidden field for clinical_record_type_id */}
            <input type="hidden" {...control.register('clinical_record_type_id')} />

            <div className="d-flex flex-column mb-3">
                <Controller
                    name="label"
                    control={control}
                    rules={{ required: "El label es requerido" }}
                    render={({ field }) => (<>
                        <label htmlFor="label" className="form-label">Label *</label>
                        <InputText id="label" {...field} className="w-100" />
                    </>)}
                />
                {getFormErrorMessage("label")}
            </div>

            <div className="d-flex flex-column mb-3">
                <Controller
                    name="type"
                    control={control}
                    rules={{ required: "El tipo es requerido" }}
                    render={({ field }) => (<>
                        <label htmlFor="type" className="form-label">Tipo *</label>
                        <Dropdown
                            id="type"
                            {...field}
                            options={typeOptions}
                            className="w-100"
                        />
                    </>)}
                />
                {getFormErrorMessage("type")}
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
                                    tooltip="Crear nuevo formulario"
                                />
                                <Button
                                    icon={<i className="fa fa-eye" />}
                                    type="button"
                                    disabled={!dynamicForm}
                                    onClick={() => { setShowFormPreviewDialog(true) }}
                                    tooltip="Previsualizar"
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
            onSubmit={
                // Wrap save to refresh dynamicForms list if needed, usually hooks share query cache
                save
            }
            loading={isLoadingForm}
        />
    </>);
};
