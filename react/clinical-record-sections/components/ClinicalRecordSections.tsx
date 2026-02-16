import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useClinicalRecordSections } from '../hooks/useClinicalRecordSections';
import { ClinicalRecordSectionsTable } from './ClinicalRecordSectionsTable';
import { ClinicalRecordSectionsForm } from './ClinicalRecordSectionsForm';
import { ClinicalRecordSection, ClinicalRecordSectionFormInputs } from '../interfaces/models';
import { useClinicalRecordType } from '../../clinical-record-types/hooks/useClinicalRecordType';

interface ClinicalRecordSectionsProps {
    clinicalRecordTypeId: string;
}

export const ClinicalRecordSections = (props: ClinicalRecordSectionsProps) => {
    const { clinicalRecordTypeId } = props;

    const { clinicalRecordType } = useClinicalRecordType(clinicalRecordTypeId);

    const {
        sections,
        isFetching,
        isSaving,
        save,
        remove,
        reorderSections,
        refetch,
        toastCreate,
        toastUpdate,
        toastDelete
    } = useClinicalRecordSections(clinicalRecordTypeId);

    const [showDialog, setShowDialog] = useState(false);
    const [selectedSection, setSelectedSection] = useState<ClinicalRecordSectionFormInputs | null>(null);


    const openNew = () => {
        setSelectedSection(null);
        setShowDialog(true);
    };

    const openEdit = (section: ClinicalRecordSection) => {
        // Map data to match form inputs
        const formData: ClinicalRecordSectionFormInputs = {
            id: section.id,
            clinical_record_type_id: section.clinical_record_type_id,
            dynamic_form_id: section.dynamic_form_id,
            type: section.type,
            label: section.label || '',
            order: section.order
        };
        setSelectedSection(formData);
        setShowDialog(true);
    };

    const handleDelete = async (section: ClinicalRecordSection) => {
        remove(section.id);
    };

    const handleSubmit = async (data: ClinicalRecordSectionFormInputs) => {
        const success = await save(data);

        if (success) {
            setShowDialog(false);
            setSelectedSection(null);
        }
    };


    const dialogFooter = (
        <div className="d-flex justify-content-end gap-2">
            <Button
                label="Cancelar"
                icon={<i className="fa fa-times me-2" />}
                onClick={() => setShowDialog(false)}
                className="p-button-text"
            />
            <Button
                label="Guardar"
                icon={<i className="fa fa-save me-2" />}
                onClick={() => {
                    const formElement = document.getElementById('clinical-record-section-form') as HTMLFormElement;
                    if (formElement) formElement.requestSubmit();
                }}
                disabled={isSaving}
                autoFocus
            />
        </div>
    );

    return (
        <div className="container-fluid p-0">
            <Toast ref={toastCreate} />
            <Toast ref={toastUpdate} />
            <Toast ref={toastDelete} />

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex align-items-center gap-3">
                    <div>
                        <h4 className="m-0 fw-bold">Secciones: {clinicalRecordType?.name}</h4>
                        <small className="text-muted">Gestiona las secciones dinámicas para este tipo de historia clínica</small>
                    </div>
                </div>
                <Button
                    label="Nueva Sección"
                    icon={<i className="fa fa-plus me-2" />}
                    onClick={openNew}
                />
            </div>

            <ClinicalRecordSectionsTable
                data={sections}
                loading={isFetching}
                onEdit={openEdit}
                onDelete={handleDelete}
                onReload={refetch}
                onReorder={reorderSections}
            />

            <Dialog
                visible={showDialog}
                style={{ width: '450px' }}
                header={selectedSection ? "Editar Sección" : "Nueva Sección"}
                modal
                className="p-fluid"
                footer={dialogFooter}
                onHide={() => setShowDialog(false)}
            >
                <ClinicalRecordSectionsForm
                    formId="clinical-record-section-form"
                    clinicalRecordTypeId={clinicalRecordTypeId}
                    initialData={selectedSection}
                    onSubmit={handleSubmit}
                />
            </Dialog>
        </div>
    );
};
