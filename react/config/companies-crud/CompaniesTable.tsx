import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Company } from '../company-configuration/types/consultorio';

interface CompaniesTableProps {
    data: Company[];
    loading: boolean;
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
}

export const CompaniesTable: React.FC<CompaniesTableProps> = (props) => {
    const { data, loading, onEdit, onDelete } = props;

    const actionBodyTemplate = (rowData: Company) => {
        return (
            <div className="d-flex gap-2 justify-content-center">
                <Button
                    icon={<i className="fa fa-pencil" />}
                    className="p-button-rounded p-button-text p-button-warning"
                    onClick={() => onEdit(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon={<i className="fa fa-trash" />}
                    className="p-button-rounded p-button-text p-button-danger"
                    onClick={() => onDelete(rowData)}
                    tooltip="Eliminar"
                />
            </div>
        );
    };

    const logoTemplate = (rowData: Company) => {
        if (!rowData.logo) return null;
        return (
            <img
                src={rowData.logo}
                alt={rowData.legal_name}
                style={{ width: '50px', height: 'auto', objectFit: 'contain' }}
            />
        );
    };

    return (
        <DataTable
            value={data}
            loading={loading}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            emptyMessage="No se encontraron empresas"
            className="p-datatable-sm shadow-sm"
            showGridlines
            stripedRows
        >
            <Column body={logoTemplate} header="Logo" style={{ width: '80px' }} />
            <Column field="legal_name" header="Razón Social" sortable />
            <Column field="nit" header="NIT" sortable />
            <Column field="email" header="Email" sortable />
            <Column field="phone" header="Teléfono" />
            <Column field="city" header="Ciudad" sortable />
            <Column body={actionBodyTemplate} header="Acciones" style={{ width: '120px', textAlign: 'center' }} />
        </DataTable>
    );
};
