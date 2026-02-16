import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
export const CompaniesTable = props => {
  const {
    data,
    loading,
    onEdit,
    onDelete
  } = props;
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 justify-content-center"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-pencil"
      }),
      className: "p-button-rounded p-button-text p-button-warning",
      onClick: () => onEdit(rowData),
      tooltip: "Editar"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-trash"
      }),
      className: "p-button-rounded p-button-text p-button-danger",
      onClick: () => onDelete(rowData),
      tooltip: "Eliminar"
    }));
  };
  const logoTemplate = rowData => {
    if (!rowData.logo) return null;
    return /*#__PURE__*/React.createElement("img", {
      src: rowData.logo,
      alt: rowData.legal_name,
      style: {
        width: '50px',
        height: 'auto',
        objectFit: 'contain'
      }
    });
  };
  return /*#__PURE__*/React.createElement(DataTable, {
    value: data,
    loading: loading,
    paginator: true,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25],
    emptyMessage: "No se encontraron empresas",
    className: "p-datatable-sm shadow-sm",
    showGridlines: true,
    stripedRows: true
  }, /*#__PURE__*/React.createElement(Column, {
    body: logoTemplate,
    header: "Logo",
    style: {
      width: '80px'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "legal_name",
    header: "Raz\xF3n Social",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "nit",
    header: "NIT",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "email",
    header: "Email",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "phone",
    header: "Tel\xE9fono"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "city",
    header: "Ciudad",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: '120px',
      textAlign: 'center'
    }
  }));
};