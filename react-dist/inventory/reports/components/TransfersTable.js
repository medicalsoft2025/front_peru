import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { formatDate, formatCurrency } from "./utils.js";
export const TransfersTable = ({
  deposits,
  loading
}) => {
  const [expandedRows, setExpandedRows] = useState(null);
  const rowExpansionTemplate = deposit => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h6", {
      className: "mb-2"
    }, "Detalle de Traslados - ", deposit.deposit_name), /*#__PURE__*/React.createElement(DataTable, {
      value: deposit.movements,
      size: "small",
      responsiveLayout: "scroll",
      paginator: true,
      rows: 5,
      rowsPerPageOptions: [5, 10, 20],
      emptyMessage: "No hay traslados"
    }, /*#__PURE__*/React.createElement(Column, {
      header: "Empresa",
      body: rowData => rowData.company?.name || 'N/A',
      style: {
        width: '150px'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "movement_date",
      header: "Fecha",
      body: rowData => formatDate(rowData.movement_date),
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Origen",
      field: "source_deposit_name",
      sortable: true,
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: rowData.type === 'exit' ? 'fw-bold' : ''
      }, rowData.source_deposit_name)
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Destino",
      field: "destination_deposit_name",
      sortable: true,
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: rowData.type === 'entry' ? 'fw-bold' : ''
      }, rowData.destination_deposit_name)
    }), /*#__PURE__*/React.createElement(Column, {
      header: "Producto/Lote",
      body: rowData => /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", null, rowData.product?.name || `Producto ID: ${rowData.product_id || 'N/A'}`), rowData.product?.code && /*#__PURE__*/React.createElement("small", {
        className: "d-block text-muted"
      }, rowData.product.code), rowData.lot && /*#__PURE__*/React.createElement("small", {
        className: "text-muted"
      }, "Lote: ", rowData.lot.lot_number))
    }), /*#__PURE__*/React.createElement(Column, {
      field: "quantity",
      header: "Cantidad",
      body: rowData => /*#__PURE__*/React.createElement("span", null, rowData.quantity),
      sortable: true,
      style: {
        textAlign: 'right'
      }
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_with_tax",
      header: "Total ($)",
      body: rowData => /*#__PURE__*/React.createElement("span", {
        className: "fw-bold"
      }, formatCurrency(rowData.total_with_tax || 0)),
      style: {
        textAlign: 'right'
      },
      sortable: true
    })));
  };
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
  return /*#__PURE__*/React.createElement(DataTable, {
    value: deposits,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [10, 20, 50],
    loading: loading,
    emptyMessage: "No se encontraron dep\xF3sitos con traslados relacionados",
    className: "p-datatable-striped p-datatable-gridlines",
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "deposit_id"
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: '3em'
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
    field: "total_movements_count",
    header: "Cant. Traslados",
    sortable: true,
    style: {
      textAlign: 'center',
      width: '120px'
    },
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.total_movements_count > 0 ? "bg-primary" : "bg-secondary"}`
    }, rowData.total_movements_count)
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total_value",
    header: "Valor Total Traslados",
    body: rowData => /*#__PURE__*/React.createElement("span", {
      className: "text-info fw-bold"
    }, formatCurrency(rowData.total_value)),
    sortable: true,
    style: {
      textAlign: 'right',
      width: '150px'
    }
  }));
};