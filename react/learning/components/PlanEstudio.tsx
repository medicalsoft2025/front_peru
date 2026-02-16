import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useLocalStorageContext } from '../context/LocalStorageContext';
import { PlanEstudioFormContainer } from './PlanEstudioFormContainer';
import { PlanEstudioTableContainer } from './PlanEstudioTableContainer';
import { PlanEstudioFormData } from '../interfaces/types';
import { usePRToast } from '../../hooks/usePRToast';
import { Toast } from 'primereact/toast';

export const PlanEstudio = () => {

    const { setSelectedItem } = useLocalStorageContext<PlanEstudioFormData>();
    const [dialogVisible, setDialogVisible] = useState(false);
    const { toast } = usePRToast(); // Using the toast hook here if needed for global notifications or pass ref

    const openDialogCreate = () => {
        setSelectedItem(null);
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
        setSelectedItem(null);
    };

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

            {/* We pass the UI handlers to containers via props or keeping them clean if they just need data */}
            <PlanEstudioTableContainer
                onEdit={(item) => {
                    setSelectedItem(item);
                    setDialogVisible(true);
                }}
            />

            <Dialog
                visible={dialogVisible}
                onHide={closeDialog}
                header="Gestión de Plan de Estudio"
                style={{ width: '50vw' }}
            >
                <PlanEstudioFormContainer onCancel={closeDialog} onSuccess={closeDialog} />
            </Dialog>
        </>
    );
}