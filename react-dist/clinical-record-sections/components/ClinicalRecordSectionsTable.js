import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
export const ClinicalRecordSectionsTable = props => {
  const {
    data,
    loading,
    onEdit,
    onDelete,
    onReload,
    onReorder
  } = props;

  // We can use a map for types if needed to show user friendly label
  const typeLabelMap = {
    'finish_modal_tab': 'Tab en ventana de finalizar consulta'
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 justify-content-center"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-pencil"
      }),
      className: "p-button-sm p-button-rounded p-button-text",
      onClick: () => onEdit(rowData),
      tooltip: "Editar"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-trash"
      }),
      className: "p-button-sm p-button-rounded p-button-text p-button-danger",
      onClick: () => onDelete(rowData),
      tooltip: "Eliminar"
    }));
  };
  const dynamicFormBodyTemplate = rowData => {
    return rowData.dynamic_form?.name || rowData.dynamic_form_id;
  };
  const typeBodyTemplate = rowData => {
    return typeLabelMap[rowData.type] || rowData.type;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm border-0"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: data,
    loading: loading,
    reorderableRows: true,
    onRowReorder: e => onReorder(e.value),
    dataKey: "id",
    responsiveLayout: "scroll",
    emptyMessage: "No hay secciones definidas",
    stripedRows: true,
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    rowReorder: true,
    style: {
      width: '3rem'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "label",
    header: "Label"
  }), /*#__PURE__*/React.createElement(Column, {
    field: "type",
    header: "Tipo",
    body: typeBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    field: "dynamic_form_id",
    header: "Formulario",
    body: dynamicFormBodyTemplate
  }), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      width: '8rem',
      textAlign: 'center'
    }
  })));
};