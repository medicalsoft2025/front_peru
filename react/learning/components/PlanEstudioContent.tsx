import React from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { PlanEstudioForm } from './PlanEstudioForm';
import { PlanEstudioTable } from './PlanEstudioTable';
import { useLocalStorageContext } from '../context/LocalStorageContext';
import { Toast } from 'primereact/toast';

export const PlanEstudioContent = () => {

    const { dialogVisible, openDialogCreate, closeDialog, toast } = useLocalStorageContext();

    return (
        <>
            <Toast ref={toast} />
            <div className="d-flex justify-content-end align-items-center mb-3">
                <Button
                    label="Agregar Item"
                    icon={<i className="fa fa-plus me-1"></i>}
                    onClick={openDialogCreate}
                />
            </div>
            <PlanEstudioTable />
            <Dialog
                visible={dialogVisible}
                onHide={closeDialog}
                header="Agregar Item"
                style={{ width: '50vw' }}
            >
                <PlanEstudioForm />
            </Dialog>
        </>
    );
}