import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Company } from '../company-configuration/types/consultorio';

interface CompaniesListProps {
    data: Company[];
    loading: boolean;
    onEdit: (company: Company) => void;
    onDelete: (company: Company) => void;
    onReload: () => void;
}

export const CompaniesList: React.FC<CompaniesListProps> = ({
    data,
    loading,
    onEdit,
    onDelete,
    onReload
}) => {


    const logoBodyTemplate = (rowData: Company) => {
        if (!rowData.logo) return null;

        let imageUrl = rowData.logo_minio_url;
        if (!imageUrl.startsWith('http')) {
            // Basic handling, assuming relative path needs storage prefix if not present
            // This mimics what was seen in GeneralInfoTab but strictly we might need a helper
            // For now, we display it simply. If it's a file path, we might need the full URL logic.
            // We'll just show the path text if image fails or nothing if intricate.
            // Actually, let's try to render it if it looks like a path.
            const baseUrl = "https://dev.monaros.co/storage/"; // Fallback based on GeneralInfoTab
            imageUrl = `${baseUrl}${rowData.logo.replaceAll("\\", "/")}`;
        }

        return (
            <img
                src={imageUrl}
                alt={rowData.legal_name}
                style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                onError={(e) => (e.currentTarget.style.display = 'none')}
            />
        );
    };

    const actionBodyTemplate = (rowData: Company) => {
        return (
            <div className="d-flex gap-2">
                <Button
                    icon={<i className="fa-solid fa-pen-to-square"></i>}
                    className="p-button-text p-button-warning"
                    onClick={() => onEdit(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon={<i className="fa-solid fa-trash"></i>}
                    className="p-button-text p-button-danger"
                    onClick={() => onDelete(rowData)}
                    tooltip="Eliminar"
                />
            </div>
        );
    };

    const refreshHeader = () => {
        return (
            <div className="flex justify-content-end">
                <Button
                    icon={<i className="fa-solid fa-sync"></i>}
                    onClick={onReload}
                    tooltip="Recargar"
                />
            </div>
        );
    };

    return (
        <DataTable
            value={data}
            loading={loading}
            paginator
            rows={10}
            header={refreshHeader()}
            emptyMessage="No se encontraron empresas"
            className="p-datatable-sm"
        >
            <Column header="Logo" body={logoBodyTemplate} style={{ width: '10%' }} />
            <Column field="legal_name" header="Nombre Comercial" sortable filter />
            <Column field="document_number" header="Documento" sortable filter />
            <Column field="phone" header="Teléfono" sortable />
            <Column field="email" header="Correo" sortable />
            <Column field="city" header="Ciudad" sortable />
            <Column body={actionBodyTemplate} header="Acciones" style={{ width: '10%', textAlign: 'center' }} />
        </DataTable>
    );
};
