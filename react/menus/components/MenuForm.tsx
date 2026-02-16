import React, { useEffect, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dropdown } from 'primereact/dropdown';
import { useDynamicForms } from '../../app-forms/hooks/useDynamicForms';
import { DynamicForm } from '../../dynamic-form/components/DynamicForm';
import { AppFormsFormDialog } from '../../app-forms/components/AppFormsFormDialog';
import { useAppForms } from '../../app-forms/hooks/useAppForms';

export interface MenuFormData {
    id?: number;
    label: string;
    icon: string;
    dynamic_form_id: string | null;
}

interface MenuFormProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (data: MenuFormData) => void;
    defaultValues?: MenuFormData;
    mode: 'create' | 'edit';
    isSystemMenu?: boolean;
}

export const MenuForm: React.FC<MenuFormProps> = ({ visible, onHide, onSubmit, defaultValues, mode, isSystemMenu }) => {

    const [showFormPreviewDialog, setShowFormPreviewDialog] = useState(false);
    const [showFormEditorDialog, setShowFormEditorDialog] = useState(false);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<MenuFormData>({
        defaultValues: {
            label: '',
            icon: '',
            dynamic_form_id: null
        }
    });

    const { dynamicForms } = useDynamicForms();

    const dynamicFormId = useWatch({
        control,
        name: "dynamic_form_id"
    });

    const dynamicForm = dynamicForms?.find((form) => form.id == dynamicFormId);

    const { save, isFetchingForm: isLoadingForm, toastCreate: toastCreateForm } = useAppForms();

    useEffect(() => {
        if (visible) {
            reset(defaultValues || {
                label: '',
                icon: '',
                dynamic_form_id: null
            });
        }
    }, [visible, defaultValues, reset]);

    const submitForm = (data: MenuFormData) => {
        onSubmit(data);
        onHide();
    };

    const getFormErrorMessage = (name: keyof MenuFormData) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        );
    };

    const footer = (
        <div className='d-flex gap-2 justify-content-end align-items-center'>
            <Button
                label="Cancelar"
                icon={<i className='fa fa-times me-1'></i>}
                onClick={onHide}
                severity='secondary'
                type='button'
            />
            <Button
                label="Guardar"
                icon={<i className='fa fa-check me-1'></i>}
                onClick={handleSubmit(submitForm)}
                type='submit'
            />
        </div>
    );

    return (<>
        <Dialog header={mode === 'create' ? "Nuevo Menú" : "Editar Menú"} visible={visible} style={{ width: '50vw' }} footer={footer} onHide={onHide}>
            <form onSubmit={handleSubmit(submitForm)} className="p-fluid">
                <div className="row mb-3">
                    <div className="col-12">
                        <label htmlFor="label" className="form-label">Etiqueta</label>
                        <Controller
                            name="label"
                            control={control}
                            rules={{ required: 'La etiqueta es requerida' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputText
                                        id="label"
                                        {...field}
                                        className={classNames({ 'p-invalid': fieldState.invalid })}
                                    />
                                    {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                                </>
                            )}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col-12">
                        <label htmlFor="icon" className="form-label">Icono (Clase CSS)</label>
                        <Controller
                            name="icon"
                            control={control}
                            render={({ field }) => (
                                <InputText id="icon" {...field} />
                            )}
                        />
                        <small className="text-muted">Ejemplo: fa fa-home</small>
                    </div>
                </div>

                {!isSystemMenu && (
                    <div className="row mb-3">
                        <div className="col-12">
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
                    </div>
                )}
            </form>
        </Dialog>

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
};
