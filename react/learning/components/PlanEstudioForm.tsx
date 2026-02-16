import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PlanEstudioFormData } from '../interfaces/types';

interface Props {
    formId?: string;
    initialData?: PlanEstudioFormData;
    loadingItem?: boolean;
    onSubmit: (data: PlanEstudioFormData) => void;
}

export const PlanEstudioForm = (props: Props) => {

    const {
        formId = 'planEstudioForm',
        initialData,
        loadingItem,
        onSubmit,
    } = props;

    const {
        control,
        handleSubmit,
        reset
    } = useForm<PlanEstudioFormData>();

    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    if (loadingItem) {
        return <div>Cargando...</div>;
    }

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)}>
            <Controller
                name="name"
                control={control}
                render={({ field }) => (
                    <input
                        type="text"
                        {...field}
                        className="form-control"
                        id="name"
                        name="name"
                        required
                    />
                )}
            />
        </form>
    );
}