import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { CashRegisterProduct } from "./interfaces";
import { formatPrice } from "../../services/utilidades";
import { CashRegisterProductHelper } from "./helpers/CashRegisterProductHelper";

interface CashRegisterPaymentProductsDetailProps {
    products: CashRegisterProduct[];
}

export const CashRegisterPaymentProductsDetail = (props: CashRegisterPaymentProductsDetailProps) => {

    const { products } = props;

    const total = CashRegisterProductHelper.calculateTotal(products);

    const productPriceBodyTemplate = (rowData: CashRegisterProduct) => {
        return formatPrice(rowData.price);
    };

    const productDiscountBodyTemplate = (rowData: CashRegisterProduct) => {
        if (!rowData.discountCalculated || rowData.discountCalculated === 0) {
            return <span className="text-muted">-</span>;
        }

        return (
            <div className="d-flex flex-column">
                <span className="text-danger">
                    - {formatPrice(rowData.discountCalculated)}
                </span>
                <small className="text-muted">
                    {rowData.discountType === 'percentage'
                        ? `(${rowData.discountAmount}%)`
                        : '(Valor fijo)'
                    }
                </small>
            </div>
        );
    };

    const productTotalBodyTemplate = (rowData: CashRegisterProduct) => {
        const subtotal = rowData.price * rowData.quantity;
        const totalConDescuento = subtotal - (rowData.discountCalculated ?? 0);
        const tieneDescuento = rowData.discountCalculated > 0;

        return (
            <div className="d-flex justify-content-end flex-column align-items-end">
                {tieneDescuento && (
                    <small className="text-muted text-decoration-line-through">
                        {formatPrice(subtotal)}
                    </small>
                )}
                <strong className={tieneDescuento ? 'text-success' : ''}>
                    {formatPrice(totalConDescuento)}
                </strong>
            </div>
        );
    };

    return (
        <div className="border-round border-1 surface-border">
            <DataTable
                value={products}
                className="p-datatable-sm p-datatable-gridlines"
                scrollable
                scrollHeight="flex"
                emptyMessage="No se han agregado productos"
                stripedRows
                footer={
                    <div className="d-flex justify-content-between align-items-center p-2">
                        <span className="text-lg fw-bold">Total General:</span>
                        <span className="text-xl fw-bold text-primary">
                            {formatPrice(total)}
                        </span>
                    </div>
                }
            >
                <Column field="name" header="Descripción" />
                <Column
                    field="price"
                    header="Precio Unitario"
                    body={productPriceBodyTemplate}
                />
                <Column field="quantity" header="Cantidad" />
                <Column
                    field="discount"
                    header="Descuento"
                    body={productDiscountBodyTemplate}
                />
                <Column
                    field="total"
                    header="Total"
                    body={productTotalBodyTemplate}
                />
            </DataTable>
        </div>
    );
};