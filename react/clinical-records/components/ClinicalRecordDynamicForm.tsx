import React from "react";
import { useDynamicForm } from "../../app-forms/hooks/useDynamicForm";
import { DynamicForm, DynamicFormRef } from "../../dynamic-form/components/DynamicForm";

interface ClinicalRecordDynamicFormProps {
    dynamicFormId: string;
    ref: React.RefObject<DynamicFormRef>;
    onSubmit?: (values: any) => void;
    onIsInvalidChange?: (invalid: boolean) => void;
}

export const ClinicalRecordDynamicForm = (props: ClinicalRecordDynamicFormProps) => {
    const { dynamicFormId, onSubmit, onIsInvalidChange } = props;

    const { dynamicForm } = useDynamicForm(dynamicFormId);

    if (!dynamicForm) {
        return <div>Cargando...</div>;
    }

    return (
        <div>
            <DynamicForm ref={props.ref} config={dynamicForm.config} onSubmit={onSubmit} showVoiceAssistant onIsInvalidChange={onIsInvalidChange} />
        </div>
    );
};