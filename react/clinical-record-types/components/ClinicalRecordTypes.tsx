import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ClinicalRecordTypeDto } from '../interfaces/models';
import { ClinicalRecordTypesFormDialog } from './ClinicalRecordTypesFormDialog';
import { ClinicalRecordTypesTable } from './ClinicalRecordTypesTable';
import { ClinicalRecordTypeFormInputs } from '../interfaces/types';
import { ClinicalRecordTypeDtoMapper } from '../mappers/clinicalRecordTypeDtoMapper';
import { useClinicalRecordTypesComponent } from '../hooks/useClinicalRecordTypesComponent';

export const ClinicalRecordTypes = () => {

    const [showFormDialog, setShowFormDialog] = useState(false);
    const [initialData, setInitialData] = useState<ClinicalRecordTypeFormInputs | null>(null);

    const {
        clinicalRecordTypes,
        isLoadingClinicalRecordTypes,
        isLoadingClinicalRecordType,
        isLoadingCreate,
        isLoadingUpdate,
        clinicalRecordType,
        setSelectedItem,
        save,
        remove,
        fetchClinicalRecordTypes,
        toastCreate,
        toastUpdate,
        toastDelete
    } = useClinicalRecordTypesComponent();

    const onSubmit = async (data: ClinicalRecordTypeFormInputs) => {
        await save(data);
        setShowFormDialog(false);
    };

    const onCreate = () => {
        setSelectedItem(null);
        setInitialData(null);
        setShowFormDialog(true);
    };

    const onEdit = (data: ClinicalRecordTypeDto) => {
        setSelectedItem(data);
        setShowFormDialog(true);
    };

    const onDelete = (data: ClinicalRecordTypeDto) => {
        remove(data);
    };

    const onManageSections = (data: ClinicalRecordTypeDto) => {
        window.location.href = `/clinicalRecordSections?clinicalRecordTypeId=${data.id}`;
    };

    const onHide = () => {
        setShowFormDialog(false);
        setSelectedItem(null);
    };

    useEffect(() => {
        if (clinicalRecordType && clinicalRecordType.id) {
            setInitialData(ClinicalRecordTypeDtoMapper.toFormBuilderData(clinicalRecordType));
        }
    }, [clinicalRecordType]);

    console.log(clinicalRecordTypes);

    return (<>
        <Toast ref={toastCreate} />
        <Toast ref={toastUpdate} />
        <Toast ref={toastDelete} />
        <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Tipos de Historia Clinica</h2>
                <Button
                    label="Nuevo Tipo de Historia Clinica"
                    icon={<i className="fa fa-plus me-1" />}
                    onClick={onCreate}
                />
            </div>
            <ClinicalRecordTypesTable
                data={clinicalRecordTypes || []}
                onEdit={onEdit}
                onDelete={onDelete}
                loading={isLoadingClinicalRecordTypes}
                onReload={fetchClinicalRecordTypes}
                onManageSections={onManageSections}
            />
            <ClinicalRecordTypesFormDialog
                visible={showFormDialog}
                onHide={onHide}
                onSubmit={onSubmit}
                initialData={initialData}
                loading={isLoadingClinicalRecordType || isLoadingCreate || isLoadingUpdate}
            />
        </div>
    </>);
};