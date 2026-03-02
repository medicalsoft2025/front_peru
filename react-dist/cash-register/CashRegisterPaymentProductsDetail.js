import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { formatPrice } from "../../services/utilidades.js";
import { CashRegisterProductHelper } from "./helpers/CashRegisterProductHelper.js";
export const CashRegisterPaymentProductsDetail = props => {
  const {
    products
  } = props;
  const total = CashRegisterProductHelper.calculateTotal(products);
  const productPriceBodyTemplate = rowData => {
    return formatPrice(rowData.price);
  };
  const productDiscountBodyTemplate = rowData => {
    if (!rowData.discountCalculated || rowData.discountCalculated === 0) {
      return /*#__PURE__*/React.createElement("span", {
        className: "text-muted"
      }, "-");
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex flex-column"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-danger"
    }, "- ", formatPrice(rowData.discountCalculated)), /*#__PURE__*/React.createElement("small", {
      className: "text-muted"
    }, rowData.discountType === 'percentage' ? `(${rowData.discountAmount}%)` : '(Valor fijo)'));
  };
  const productTotalBodyTemplate = rowData => {
    const subtotal = rowData.price * rowData.quantity;
    const totalConDescuento = subtotal - (rowData.discountCalculated ?? 0);
    const tieneDescuento = rowData.discountCalculated > 0;
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end flex-column align-items-end"
    }, tieneDescuento && /*#__PURE__*/React.createElement("small", {
      className: "text-muted text-decoration-line-through"
    }, formatPrice(subtotal)), /*#__PURE__*/React.createElement("strong", {
      className: tieneDescuento ? 'text-success' : ''
    }, formatPrice(totalConDescuento)));
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "border-round border-1 surface-border"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: products,
    className: "p-datatable-sm p-datatable-gridlines",
    scrollable: true,
    scrollHeight: "flex",
    emptyMessage: "No se han agregado productos",
    stripedRows: true,
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center p-2"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-lg fw-bold"
    }, "Total General:"), /*#__PURE__*/React.createElement("span", {
      className: "text-xl fw-bold text-primary"
    }, formatPrice(total)))
  }, /*#__PURE__*/React.createElement(Column, {
    field: "name",
    header: "Descripci\xF3n"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "price",
    header: "Precio Unitario",
    body: productPriceBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "quantity",
    header: "Cantidad"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "discount",
    header: "Descuento",
    body: productDiscountBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total",
    header: "Total",
    body: productTotalBodyTemplate
  })));
};