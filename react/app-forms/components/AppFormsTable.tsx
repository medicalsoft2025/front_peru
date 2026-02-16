import React from 'react';
import { CustomPRTable } from '../../components/CustomPRTable';
import { Button } from 'primereact/button';
import { DynamicFormModel } from '../interfaces/models';

interface AppFormsTableProps {
    data: DynamicFormModel[];
    loading: boolean;
    onEdit: (rowData: DynamicFormModel) => void;
    onDelete: (rowData: DynamicFormModel) => void;
    onReload: () => void;
}

export const AppFormsTable = (props: AppFormsTableProps) => {

    const { data, loading, onEdit, onDelete, onReload } = props;

    const columns = [
        {
            field: 'name',
            header: 'Nombre'
        },
        {
            field: 'actions',
            header: 'Acciones',
            body: (rowData: DynamicFormModel) => {
                return (
                    <div className="d-flex gap-2">
                        <Button
                            icon={<i className="fa fa-edit" />}
                            onClick={() => onEdit(rowData)}
                        />
                        <Button
                            icon={<i className="fa fa-trash" />}
                            severity='danger'
                            onClick={() => onDelete(rowData)}
                        />
                    </div>
                );
            }
        }
    ];

    return (
        <div>
            <CustomPRTable
                data={data}
                columns={columns}
                loading={loading}
                onReload={onReload}
            />
        </div>
    );
};