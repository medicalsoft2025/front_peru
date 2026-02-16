import React, { useRef } from 'react';
import { DataTable, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { ClinicalRecordSection } from '../interfaces/models';

interface ClinicalRecordSectionsTableProps {
    data: ClinicalRecordSection[];
    loading: boolean;
    onEdit: (rowData: ClinicalRecordSection) => void;
    onDelete: (rowData: ClinicalRecordSection) => void;
    onReload: () => void;
    onReorder: (newData: ClinicalRecordSection[]) => void;
}

export const ClinicalRecordSectionsTable = (props: ClinicalRecordSectionsTableProps) => {

    const { data, loading, onEdit, onDelete, onReload, onReorder } = props;

    // We can use a map for types if needed to show user friendly label
    const typeLabelMap: { [key: string]: string } = {
        'finish_modal_tab': 'Tab en ventana de finalizar consulta'
    };

    const actionBodyTemplate = (rowData: ClinicalRecordSection) => {
        return (
            <div className="d-flex gap-2 justify-content-center">
                <Button
                    icon={<i className="fa fa-pencil" />}
                    className="p-button-sm p-button-rounded p-button-text"
                    onClick={() => onEdit(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon={<i className="fa fa-trash" />}
                    className="p-button-sm p-button-rounded p-button-text p-button-danger"
                    onClick={() => onDelete(rowData)}
                    tooltip="Eliminar"
                />
            </div>
        );
    };

    const dynamicFormBodyTemplate = (rowData: ClinicalRecordSection) => {
        return rowData.dynamic_form?.name || rowData.dynamic_form_id;
    };

    const typeBodyTemplate = (rowData: ClinicalRecordSection) => {
        return typeLabelMap[rowData.type] || rowData.type;
    };

    return (
        <div className="card shadow-sm border-0">
            <DataTable
                value={data}
                loading={loading}
                reorderableRows
                onRowReorder={(e) => onReorder(e.value as ClinicalRecordSection[])}
                dataKey="id"
                responsiveLayout="scroll"
                emptyMessage="No hay secciones definidas"
                stripedRows
                className='p-datatable-sm'
            >
                <Column rowReorder style={{ width: '3rem' }} />
                <Column field="label" header="Label" />
                <Column field="type" header="Tipo" body={typeBodyTemplate} />
                <Column field="dynamic_form_id" header="Formulario" body={dynamicFormBodyTemplate} />
                <Column header="Acciones" body={actionBodyTemplate} style={{ width: '8rem', textAlign: 'center' }} />
            </DataTable>
        </div>
    );
};
