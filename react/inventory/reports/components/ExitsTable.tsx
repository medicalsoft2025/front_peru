import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate, formatCurrency } from './utils';

interface ExitsTableProps {
    deposits: any[];
    loading: boolean;
}

export const ExitsTable: React.FC<ExitsTableProps> = ({ deposits, loading }) => {
    const [expandedRows, setExpandedRows] = useState<any>(null);

    const rowExpansionTemplate = (deposit: any) => {
        return (
            <div className="p-3">
                <h6 className="mb-2">Detalle de Salidas - {deposit.deposit_name}</h6>
                <DataTable
                    value={deposit.movements}
                    size="small"
                    responsiveLayout="scroll"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    emptyMessage="No hay movimientos de salida"
                >
                    <Column
                        header="Empresa"
                        body={(rowData: any) => rowData.company?.name || 'N/A'}
                        style={{ width: '150px' }}
                    />
                    <Column
                        field="movement_date"
                        header="Fecha"
                        body={(rowData) => formatDate(rowData.movement_date)}
                        sortable
                    />
                    <Column
                        header="Motivo"
                        body={(rowData) => rowData.reason || "Salida Manual"}
                        sortable
                    />
                    <Column
                        header="Producto/Lote"
                        body={(rowData) => (
                            <div>
                                <div>{rowData.product?.name || `Producto ID: ${rowData.product_id || 'N/A'}`}</div>
                                {rowData.product?.code && <small className="d-block text-muted">{rowData.product.code}</small>}
                                {rowData.lot && <small className="text-muted">Lote: {rowData.lot.lot_number}</small>}
                            </div>
                        )}
                    />
                    <Column
                        field="quantity"
                        header="Cantidad"
                        body={(rowData) => <span className="text-danger">-{rowData.quantity}</span>}
                        sortable
                        style={{ textAlign: 'right' }}
                    />
                    <Column
                        field="unit_price"
                        header="Precio Unit."
                        body={(rowData) => formatCurrency(rowData.unit_price || 0)}
                        style={{ textAlign: 'right' }}
                        sortable
                    />
                    <Column
                        field="total_with_tax"
                        header="Total ($)"
                        body={(rowData) => <span className="fw-bold">{formatCurrency(rowData.total_with_tax || 0)}</span>}
                        style={{ textAlign: 'right' }}
                        sortable
                    />
                </DataTable>
            </div>
        );
    };

    const depositTypeTemplate = (type: string) => {
        let badgeClass = "bg-secondary";
        let typeText = type;

        if (type === "PHARMACY") {
            badgeClass = "bg-info";
            typeText = "Farmacia";
        } else if (type === "POS_BOX") {
            badgeClass = "bg-warning";
            typeText = "Caja POS";
        } else if (type === "CLINICAL_SUPPLIES") {
            badgeClass = "bg-primary";
            typeText = "Insumos Clínicos";
        }

        return <span className={`badge ${badgeClass}`}>{typeText}</span>;
    };

    const statusTemplate = (rowData: any) => {
        return (
            <span
                className={`badge ${rowData.is_active ? "bg-success" : "bg-danger"}`}
            >
                {rowData.is_active ? "Activo" : "Inactivo"}
            </span>
        );
    };

    return (
        <DataTable
            value={deposits}
            paginator
            rows={10}
            rowsPerPageOptions={[10, 20, 50]}
            loading={loading}
            emptyMessage="No se encontraron depósitos con salidas"
            className="p-datatable-striped p-datatable-gridlines"
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="deposit_id"
        >
            <Column expander style={{ width: '3em' }} />
            <Column
                field="deposit_name"
                header="Nombre Depósito"
                sortable
                style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                body={(rowData) => <div title={rowData.deposit_name} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{rowData.deposit_name}</div>}
            />
            <Column
                field="deposit_type"
                header="Tipo"
                body={(rowData: any) => depositTypeTemplate(rowData.deposit_type)}
                sortable
                style={{ width: '120px' }}
            />
            <Column
                field="company.name"
                header="Empresa"
                body={(rowData: any) => rowData.company?.name || 'N/A'}
                sortable
                style={{ width: '150px' }}
            />
            <Column
                field="is_active"
                header="Estado"
                body={statusTemplate}
                sortable
                style={{ width: '100px' }}
            />
            <Column
                field="total_movements_count"
                header="Cant. Salidas"
                sortable
                style={{ textAlign: 'center', width: '120px' }}
                body={(rowData: any) => (
                    <span
                        className={`badge ${rowData.total_movements_count > 0 ? "bg-primary" : "bg-secondary"}`}
                    >
                        {rowData.total_movements_count}
                    </span>
                )}
            />
            <Column
                field="total_value"
                header="Total Valor Salidas"
                body={(rowData) => <span className="text-danger fw-bold">{formatCurrency(rowData.total_value)}</span>}
                sortable
                style={{ textAlign: 'right', width: '150px' }}
            />
        </DataTable>
    );
};
