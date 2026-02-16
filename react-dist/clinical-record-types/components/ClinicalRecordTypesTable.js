import React, { useRef, useState } from 'react';
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
export const ClinicalRecordTypesTable = props => {
  const {
    data,
    loading,
    onEdit,
    onDelete,
    onReload,
    onManageSections
  } = props;

  // We can't use a single Menu ref for all rows easily with DataTable without state tracking
  // But a common pattern is to have one Menu and track which row was clicked
  const menuRef = useRef(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const showMenu = (event, rowData) => {
    setSelectedRow(rowData);
    menuRef.current?.toggle(event);
  };
  const items = [{
    label: 'Editar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-edit me-1"
    }),
    command: () => selectedRow && onEdit(selectedRow)
  }, {
    label: 'Gestionar Secciones',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-list-ul me-1"
    }),
    command: () => selectedRow && onManageSections?.(selectedRow)
  }, {
    separator: true
  }, {
    label: 'Eliminar',
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-trash me-1"
    }),
    className: 'text-danger',
    command: () => selectedRow && onDelete(selectedRow)
  }];
  const columns = [{
    field: 'name',
    header: 'Nombre'
  }, {
    field: 'actions',
    header: 'Acciones',
    body: rowData => {
      return /*#__PURE__*/React.createElement("div", {
        className: "d-flex justify-content-end align-items-center gap-2"
      }, /*#__PURE__*/React.createElement(Button, {
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa fa-cog me-1"
        }),
        label: "Acciones",
        onClick: e => showMenu(e, rowData)
      }));
    }
  }];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Menu, {
    model: items,
    popup: true,
    ref: menuRef
  }), /*#__PURE__*/React.createElement(CustomPRTable, {
    data: data,
    columns: columns,
    loading: loading,
    onReload: onReload
  }));
};