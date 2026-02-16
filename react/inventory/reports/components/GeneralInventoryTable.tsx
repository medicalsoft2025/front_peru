import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate, formatCurrency } from './utils';

interface GeneralInventoryTableProps {
    reportData: any[];
    loading: boolean;
    expandedRows: any;
    setExpandedRows: (rows: any) => void;
    footerTotales: React.ReactNode;
}

export const GeneralInventoryTable: React.FC<GeneralInventoryTableProps> = ({
    reportData,
    loading,
    expandedRows,
    setExpandedRows,
    footerTotales
}) => {

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

    const relatedDepositTypeTemplate = (type: string) => {
        let textColor = "bg-secondary";
        let typeText = type;

        if (type === "related_deposit") {
            textColor = "text-info";
            typeText = "Deposito Relacionado";
        } else if (type === "source_deposit") {
            textColor = "text-warning";
            typeText = "Deposito Origen";
        } else if (type === "destination_deposit") {
            textColor = "text-success";
            typeText = "Deposito Destino";
        }

        return <small className={textColor}>{typeText}</small>;
    };

    const rowExpansionTemplate = (deposit: any) => {
        return (
            <div className="p-3">
                <h5 className="mb-3">
                    Movimientos del Depósito: {deposit.deposit_name}
                </h5>
                <DataTable
                    value={deposit.movements}
                    size="small"
                    responsiveLayout="scroll"
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    emptyMessage="No hay movimientos para este depósito"
                >
                    <Column
                        header="Empresa"
                        body={(rowData: any) => rowData.company?.name || 'N/A'}
                        style={{ width: '150px' }}
                    />
                    <Column
                        field="movement_date"
                        header="Fecha Movimiento"
                        body={(rowData: any) => formatDate(rowData.movement_date)}
                        sortable
                    />
                    <Column
                        field="type"
                        header="Tipo"
                        body={(rowData: any) => (
                            <span
                                className={`badge ${rowData.type === "entry" ? "bg-success" : "bg-warning"}`}
                            >
                                {rowData.type === "entry" ? "ENTRADA" : "SALIDA"}
                            </span>
                        )}
                        sortable
                    />
                    <Column
                        field="quantity"
                        header="Cantidad"
                        body={(rowData: any) => (
                            <span className={`fw-bold ${rowData.type === "entry" ? "text-success" : "text-danger"}`}>
                                {rowData.type === "entry" ? "+" : "-"}
                                {rowData.quantity}
                            </span>
                        )}
                        style={{ textAlign: "right" }}
                        sortable
                    />
                    <Column
                        header="Producto/Lote"
                        body={(rowData: any) => (
                            <div>
                                <div>{rowData.product?.name || `Producto ID: ${rowData.product_id || 'N/A'}`}</div>
                                {rowData.product?.code && <small className="d-block text-muted">{rowData.product.code}</small>}
                                {rowData.lot && <small className="text-muted">Lote: {rowData.lot.lot_number}</small>}
                            </div>
                        )}
                    />
                    <Column
                        header="Factura"
                        body={(rowData: any) => rowData.invoice ? <div>{rowData.invoice.invoice_code}</div> : "N/A"}
                    />
                    {/* New Financial Columns */}
                    <Column
                        header="Precio Unit."
                        body={(rowData: any) => formatCurrency(rowData.unit_price || 0)}
                        style={{ textAlign: "right", minWidth: '100px' }}
                    />
                    <Column
                        header="Impuesto"
                        body={(rowData: any) => formatCurrency(rowData.tax_amount || 0)}
                        style={{ textAlign: "right", minWidth: '100px' }}
                    />
                    <Column
                        header="Total"
                        body={(rowData: any) => (
                            <span className="fw-bold">
                                {formatCurrency(rowData.total_with_tax || 0)}
                            </span>
                        )}
                        style={{ textAlign: "right", minWidth: '110px' }}
                    />

                    <Column
                        header="Usuario"
                        body={(rowData: any) => rowData.user ? <div>{rowData.user.full_name}</div> : "N/A"}
                    />
                    <Column
                        header="Depósito Relacionado"
                        body={(rowData: any) => <>
                            {rowData.related_deposit ? (
                                <div>
                                    <div className="fw-bold">
                                        {rowData.related_deposit.name}
                                    </div>
                                    <div>
                                        {depositTypeTemplate(rowData.related_deposit.type)}
                                    </div>
                                </div>
                            ) : (
                                "N/A"
                            )}
                            {rowData.related_deposit_type && (
                                <div className="mt-1">
                                    {relatedDepositTypeTemplate(rowData.related_deposit_type)}
                                </div>
                            )}
                        </>}
                    />
                </DataTable>
            </div>
        );
    };

    return (
        <DataTable
            value={reportData}
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25, 50]}
            loading={loading}
            emptyMessage="No se encontraron depósitos con movimientos"
            className="p-datatable-striped p-datatable-gridlines"
            responsiveLayout="scroll"
            footer={footerTotales}
            expandedRows={expandedRows}
            onRowToggle={(e) => setExpandedRows(e.data)}
            rowExpansionTemplate={rowExpansionTemplate}
            dataKey="deposit_id"
        >
            <Column expander style={{ width: "3em" }} />

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
                field="total_movements"
                header="Total Mov."
                body={(rowData: any) => (
                    <span
                        className={`badge ${rowData.total_movements > 0 ? "bg-primary" : "bg-secondary"}`}
                    >
                        {rowData.total_movements}
                    </span>
                )}
                style={{ textAlign: "center", width: "100px" }}
                sortable
            />
            <Column // Added Total Value Column
                field="total_value"
                header="Total Valor ($)"
                body={(rowData: any) => {
                    // Calculate total value for this deposit's movements on the fly
                    const val = rowData.movements?.reduce((sum: number, m: any) => {
                        const amount = Number(m.total_with_tax || 0);
                        if (m.type === 'entry') return sum + amount;
                        if (m.type === 'exit') return sum - amount;
                        return sum;
                    }, 0) || 0;
                    return <span className="fw-bold">{formatCurrency(val)}</span>;
                }}
                style={{ textAlign: "right", width: '140px' }}
                sortable
            />
            <Column
                header="Último Movimiento"
                body={(rowData: any) => {
                    if (!rowData.movements || rowData.movements.length === 0) {
                        return "Sin movimientos";
                    }
                    const lastMovement = rowData.movements[0];
                    return (
                        <div>
                            <div className="small">
                                {formatDate(lastMovement.movement_date)}
                            </div>
                            <div
                                className={`small ${lastMovement.type === "entry" ? "text-success" : "text-danger"}`}
                            >
                                {lastMovement.type === "entry" ? "Entrada" : "Salida"}
                                : {lastMovement.quantity}
                            </div>
                        </div>
                    );
                }}
                style={{ width: "150px" }}
            />
        </DataTable>
    );
};
