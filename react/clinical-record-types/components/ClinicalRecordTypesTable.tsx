import React, { useRef, useState } from 'react';
import { CustomPRTable } from '../../components/CustomPRTable';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { ClinicalRecordTypeDto } from '../interfaces/models';

interface ClinicalRecordTypesTableProps {
    data: ClinicalRecordTypeDto[];
    loading: boolean;
    onEdit: (rowData: ClinicalRecordTypeDto) => void;
    onDelete: (rowData: ClinicalRecordTypeDto) => void;
    onReload: () => void;
    onManageSections?: (rowData: ClinicalRecordTypeDto) => void;
}

export const ClinicalRecordTypesTable = (props: ClinicalRecordTypesTableProps) => {

    const { data, loading, onEdit, onDelete, onReload, onManageSections } = props;

    // We can't use a single Menu ref for all rows easily with DataTable without state tracking
    // But a common pattern is to have one Menu and track which row was clicked
    const menuRef = useRef<Menu>(null);
    const [selectedRow, setSelectedRow] = useState<ClinicalRecordTypeDto | null>(null);

    const showMenu = (event: React.MouseEvent, rowData: ClinicalRecordTypeDto) => {
        setSelectedRow(rowData);
        menuRef.current?.toggle(event);
    };

    const items = [
        {
            label: 'Editar',
            icon: <i className="fa fa-edit me-1" />,
            command: () => selectedRow && onEdit(selectedRow)
        },
        {
            label: 'Gestionar Secciones',
            icon: <i className="fa fa-list-ul me-1" />,
            command: () => selectedRow && onManageSections?.(selectedRow)
        },
        {
            separator: true
        },
        {
            label: 'Eliminar',
            icon: <i className="fa fa-trash me-1" />,
            className: 'text-danger',
            command: () => selectedRow && onDelete(selectedRow)
        }
    ];

    const columns = [
        {
            field: 'name',
            header: 'Nombre'
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (rowData: ClinicalRecordTypeDto) => {
                return (
                    <div className="d-flex justify-content-end align-items-center gap-2">
                        <Button
                            icon={<i className="fa fa-cog me-1" />}
                            label='Acciones'
                            onClick={(e) => showMenu(e, rowData)}
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <div>
            <Menu model={items} popup ref={menuRef} />
            <CustomPRTable
                data={data}
                columns={columns}
                loading={loading}
                onReload={onReload}
            />
        </div>
    );
};