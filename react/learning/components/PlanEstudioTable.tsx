import React from 'react';
import { CustomPRTable } from '../../components/CustomPRTable';
import { Button } from 'primereact/button';

interface Props {
    items: any[];
    loadingItems: boolean;
    removeItem: (id: string) => void;
    editItem: (item: any) => void;
    onReload: () => void;
}

export const PlanEstudioTable = (props: Props) => {

    const { items, loadingItems, removeItem, editItem, onReload } = props;

    const columns = [
        { field: 'name', header: 'Nombre' },
        {
            field: 'actions', header: 'Acciones', body: (item: any) => (
                <div className="d-flex gap-2">
                    <Button
                        icon={<i className="fa fa-pencil" />}
                        severity="warning"
                        onClick={() => editItem(item)}
                    />
                    <Button
                        icon={<i className="fa fa-trash" />}
                        severity="danger"
                        onClick={() => removeItem(item.id)}
                    />
                </div>
            )
        }
    ]

    return (
        <CustomPRTable
            columns={columns}
            data={items}
            loading={loadingItems}
            onReload={onReload}
        />
    );
}