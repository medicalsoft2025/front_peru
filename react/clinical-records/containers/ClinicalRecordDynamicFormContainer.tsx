import React, { useRef, useState } from "react";
import { ClinicalRecordDynamicForm } from "../components/ClinicalRecordDynamicForm";
import { AddParaclinicalButton } from "../AddParaclinicalButton";
import { SeePatientInfoButton } from "../../patients/SeePatientInfoButton";
import { Breadcrumb } from "../../layout/breadcrumb/Breadcrumb";
import { usePatient } from "../../patients/hooks/usePatient";
import { TimerApp } from "../../components/timer/TimerApp";
import { Button } from "primereact/button";
import { FinishClinicalRecordModal } from "../FinishClinicalRecordModal";
import { ClinicalRecordData } from "../interfaces";
import { DynamicFormRef } from "../../dynamic-form/components/DynamicForm";

export const ClinicalRecordDynamicFormContainer = () => {

    const patientId = new URLSearchParams(window.location.search).get('patient_id');
    const speciality = new URLSearchParams(window.location.search).get('especialidad');
    const dynamicFormId = new URLSearchParams(window.location.search).get('dynamic_form_id');
    const appointmentId = new URLSearchParams(window.location.search).get('appointment_id');

    const [formValues, setFormValues] = useState<ClinicalRecordData>({
        tabsStructure: [],
        values: {},
        rips: []
    });
    const [isInvalid, setIsInvalid] = useState(false);

    const { patient } = usePatient(patientId);

    const patientName = patient?.full_name || "Cargando...";
    const backUrl = `consultas-especialidad?patient_id=${patientId}&especialidad=${speciality}&appointment_id=${appointmentId}`;

    const breadcrumbItems = [
        { label: "Inicio", href: "Dashboard" },
        { label: "Pacientes", href: "pacientes" },
        { label: patientName, href: `verPaciente?id=${patientId}` },
        { label: "Consultas", href: backUrl }
    ];

    const dynamicFormRef = useRef<DynamicFormRef>(null);
    const finishConsultationModalRef = useRef<any>(null);

    const handleCancelConsultation = () => {
        window.location.href = backUrl;
    };

    const handleFinishConsultation = () => {
        dynamicFormRef.current?.handleSubmit();
        finishConsultationModalRef.current?.showModal();
    };

    const handleFormSubmit = (values: any) => {
        setFormValues((prev) => ({
            ...prev,
            values: values
        }));
    };

    const handleIsInvalidChange = (invalid: boolean) => {
        setIsInvalid(invalid);
    };

    return (
        <>
            <Breadcrumb items={breadcrumbItems} activeItem="Consulta Primera vez" />
            <div className="d-flex align-items-center justify-content-between gap-2 mb-3">
                <div className="d-flex flex-grow-1">
                    <div className="d-flex flex-column">
                        <h2 className="mb-0">Nueva Consulta</h2>
                        <small>{patientName}</small>
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-end gap-2">
                    <div className="d-inline-flex">
                        <AddParaclinicalButton />
                    </div>
                    <SeePatientInfoButton patientId={patientId} />
                </div>
            </div>
            <ClinicalRecordDynamicForm ref={dynamicFormRef} dynamicFormId={dynamicFormId} onSubmit={handleFormSubmit} onIsInvalidChange={handleIsInvalidChange} />
            <div className="mt-3">
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        Tiempo en consulta: <TimerApp />
                    </div>
                    <div className="d-flex align-items-center justify-content-end gap-2">
                        <Button
                            severity="danger"
                            type="button"
                            onClick={handleCancelConsultation}
                            label="Cancelar consulta"
                        />
                        <Button
                            type="button"
                            onClick={handleFinishConsultation}
                            disabled={isInvalid}
                            label="Terminar consulta"
                        />
                    </div>
                </div>
            </div>
            <FinishClinicalRecordModal ref={finishConsultationModalRef} initialExternalDynamicData={formValues} />
        </>
    );
};