import React from 'react';
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { Button } from 'primereact/button';
export const AppFormsTable = props => {
  const {
    data,
    loading,
    onEdit,
    onDelete,
    onReload
  } = props;
  const columns = [{
    field: 'name',
    header: 'Nombre'
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex gap-2"
      }, /*#__PURE__*/React.createElement(Button, {
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa fa-edit"
        }),
        onClick: () => onEdit(rowData)
      }), /*#__PURE__*/React.createElement(Button, {
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa fa-trash"
        }),
        severity: "danger",
        onClick: () => onDelete(rowData)
      }));
    }
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: data,
    columns: columns,
    loading: loading,
    onReload: onReload
  }));
};