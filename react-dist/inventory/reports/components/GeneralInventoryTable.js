import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate, formatCurrency } from "./utils.js";
export const GeneralInventoryTable = ({
  reportData,
  loading,
  expandedRows,
  setExpandedRows,
  footerTotales
}) => {
  const depositTypeTemplate = type => {
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
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${badgeClass}`
    }, typeText);
  };
  const statusTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.is_active ? "bg-success" : "bg-danger"}`
    }, rowData.is_active ? "Activo" : "Inactivo");
  };
  const relatedDepositTypeTemplate = type => {
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
    return /*#__PURE__*/React.createElement("small", {
      className: textColor
    }, typeText);
  };
  const rowExpansionTemplate = deposit => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, "Movimientos del Dep\xF3sito: ", deposit.deposit_name), /*#__PURE__*/React.createElement(DataTable, {
      value: deposit.movements,
      size: "small",
      responsiveLayout: "scroll",
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20],
      emptyMessage: "No hay movimientos para este dep\xF3sito"
    }, /*#__PURE__*/React.createElement(Column, {
      header: "Empresa",
      body: rowData => rowData.company?.name || 'N/A',
      style: {
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "movement_date",
      header: "Fecha Movimiento",
      body: rowData => formatDate(rowData.movement_date),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "type",
      header: "Tipo",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: `badge ${rowData.type === "entry" ? "bg-success" : "bg-warning"}`
      }, rowData.type === "entry" ? "ENTRADA" : "SALIDA"),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "quantity",
      header: "Cantidad",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: `fw-bold ${rowData.type === "entry" ? "text-success" : "text-danger"}`
      }, rowData.type === "entry" ? "+" : "-", rowData.quantity),
      style: {
        textAlign: "right"
      },
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Producto/Lote",
      body: rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, rowData.product?.name || `Producto ID: ${rowData.product_id || 'N/A'}`), rowData.product?.code && /*#__PURE__*/React.createElement("small", {
        className: "d-block text-muted"
      }, rowData.product.code), rowData.lot && /*#__PURE__*/React.createElement("small", {
        className: "text-muted"
      }, "Lote: ", rowData.lot.lot_number))
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Factura",
      body: rowData => rowData.invoice ? /*#__PURE__*/React.createElement("div", null, rowData.invoice.invoice_code) : "N/A"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Precio Unit.",
      body: rowData => formatCurrency(rowData.unit_price || 0),
      style: {
        textAlign: "right",
        minWidth: '100px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Impuesto",
      body: rowData => formatCurrency(rowData.tax_amount || 0),
      style: {
        textAlign: "right",
        minWidth: '100px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Total",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, formatCurrency(rowData.total_with_tax || 0)),
      style: {
        textAlign: "right",
        minWidth: '110px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Usuario",
      body: rowData => rowData.user ? /*#__PURE__*/React.createElement("div", null, rowData.user.full_name) : "N/A"
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Dep\xF3sito Relacionado",
      body: rowData => /*#__PURE__*/React.createElement(React.Fragment, null, rowData.related_deposit ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "fw-bold"
      }, rowData.related_deposit.name), /*#__PURE__*/React.createElement("div", null, depositTypeTemplate(rowData.related_deposit.type))) : "N/A", rowData.related_deposit_type && /*#__PURE__*/React.createElement("div", {
        className: "mt-1"
      }, relatedDepositTypeTemplate(rowData.related_deposit_type)))
    })));
  };
  return /*#__PURE__*/React.createElement(DataTable, {
    value: reportData,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50],
    loading: loading,
    emptyMessage: "No se encontraron dep\xF3sitos con movimientos",
    className: "p-datatable-striped p-datatable-gridlines",
    responsiveLayout: "scroll",
    footer: footerTotales,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "deposit_id"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: "3em"
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "deposit_name",
    header: "Nombre Dep\xF3sito",
    sortable: true,
    style: {
      maxWidth: '200px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    body: rowData => /*#__PURE__*/React.createElement("div", {
      title: rowData.deposit_name,
      style: {
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, rowData.deposit_name)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "deposit_type",
    header: "Tipo",
    body: rowData => depositTypeTemplate(rowData.deposit_type),
    sortable: true,
    style: {
      width: '120px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "company.name",
    header: "Empresa",
    body: rowData => rowData.company?.name || 'N/A',
    sortable: true,
    style: {
      width: '150px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "is_active",
    header: "Estado",
    body: statusTemplate,
    sortable: true,
    style: {
      width: '100px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total_movements",
    header: "Total Mov.",
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.total_movements > 0 ? "bg-primary" : "bg-secondary"}`
    }, rowData.total_movements),
    style: {
      textAlign: "center",
      width: "100px"
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column // Added Total Value Column
  , {
    field: "total_value",
    header: "Total Valor ($)",
    body: rowData => {
      // Calculate total value for this deposit's movements on the fly
      const val = rowData.movements?.reduce((sum, m) => {
        const amount = Number(m.total_with_tax || 0);
        if (m.type === 'entry') return sum + amount;
        if (m.type === 'exit') return sum - amount;
        return sum;
      }, 0) || 0;
      return /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, formatCurrency(val));
    },
    style: {
      textAlign: "right",
      width: '140px'
    },
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    header: "\xDAltimo Movimiento",
    body: rowData => {
      if (!rowData.movements || rowData.movements.length === 0) {
        return "Sin movimientos";
      }
      const lastMovement = rowData.movements[0];
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        className: "small"
      }, formatDate(lastMovement.movement_date)), /*#__PURE__*/React.createElement("div", {
        className: `small ${lastMovement.type === "entry" ? "text-success" : "text-danger"}`
      }, lastMovement.type === "entry" ? "Entrada" : "Salida", ": ", lastMovement.quantity));
    },
    style: {
      width: "150px"
    }
  }));
};