import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { AppFormsFormInputs } from '../interfaces/types';
import { FormBuilder } from '../../form-builder/components/FormBuilder';

interface AppFormsFormProps {
    formId: string;
    onSubmit: (data: AppFormsFormInputs) => void;
}

export const AppFormsForm = (props: AppFormsFormProps) => {

    const { formId, onSubmit } = props;

    return (
        <form id={formId}>
            <div className="d-flex flex-column">

            </div>
        </form>
    );
};