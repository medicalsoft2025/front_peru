import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Company } from '../company-configuration/types/consultorio';
import { CompanyForm } from './CompanyForm';

interface CompaniesFormDialogProps {
    visible: boolean;
    onHide: () => void;
    initialData: Company | null;
    onSaveSuccess: () => void;
}

export const CompaniesFormDialog: React.FC<CompaniesFormDialogProps> = (props) => {
    const { visible, onHide, initialData, onSaveSuccess } = props;

    return (
        <Dialog
            header={initialData ? "Editar Empresa" : "Nueva Empresa"}
            visible={visible}
            onHide={onHide}
            style={{ width: '80vw', maxWidth: '1000px' }}
            modal
            maximizable
        >
            <CompanyForm
                initialData={initialData}
                onSaveSuccess={onSaveSuccess}
            />
        </Dialog>
    );
};
