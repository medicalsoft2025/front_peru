import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { EnvironmentalCalendarFilterFormValues, EnvironmentalCalendarFilterType } from '../interfaces/types';

interface EnvironmentalFilterFormProps {
    formId: string;
    onSubmit: (data: EnvironmentalCalendarFilterFormValues) => void;
    type: EnvironmentalCalendarFilterType;
    initialValues?: EnvironmentalCalendarFilterFormValues;
}

export const EnvironmentalFilterForm = ({ formId, onSubmit, type, initialValues }: EnvironmentalFilterFormProps) => {

    const { control, handleSubmit, formState: { errors }, reset } = useForm<EnvironmentalCalendarFilterFormValues>({
        defaultValues: {
            name: '',
        }
    });

    useEffect(() => {
        if (initialValues) {
            reset(initialValues);
        } else {
            reset({ name: '' });
        }
    }, [initialValues, reset]);

    return (<>
        <form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Controller
                name="name"
                control={control}
                rules={{
                    required: true,
                }}
                render={({ field }) => (<>
                    <div className='d-flex flex-column gap-2 mb-3'>
                        <label htmlFor="name" className="form-label">Nombre</label>
                        <InputText
                            {...field}
                            placeholder="Nombre"
                            className={`w-100 ${classNames({ 'p-invalid': errors.name })}`}
                        />
                    </div>
                </>)}
            />
        </form>
    </>);
};