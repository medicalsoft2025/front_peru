import React from "react";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm";
import { formConfig } from "../config/form";
import { usePatientEvolutionCreate } from "../hooks/usePatientEvolutionCreate";
import { useLoggedUser } from "../../users/hooks/useLoggedUser";

interface PatientEvolutionFormProps {
    clinicalRecordId: string;
}

export const PatientEvolutionForm = (props: PatientEvolutionFormProps) => {

    const { clinicalRecordId } = props;
    const { loggedUser } = useLoggedUser()

    const { createPatientEvolution, loading } = usePatientEvolutionCreate();

    const onSubmit = (data: any) => {
        createPatientEvolution({
            ...data,
            create_by_user_id: loggedUser?.id,
            is_active: true,
        }, clinicalRecordId);
    };

    return (
        <div>
            <DynamicForm config={formConfig} onSubmit={onSubmit} loading={loading} />
        </div>
    );
};