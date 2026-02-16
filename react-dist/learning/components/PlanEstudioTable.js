import React from 'react';
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { Button } from 'primereact/button';
export const PlanEstudioTable = props => {
  const {
    items,
    loadingItems,
    removeItem,
    editItem,
    onReload
  } = props;
  const columns = [{
    field: 'name',
    header: 'Nombre'
  }, {
    field: 'actions',
    header: 'Acciones',
    body: item => /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-pencil"
      }),
      severity: "warning",
      onClick: () => editItem(item)
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-trash"
      }),
      severity: "danger",
      onClick: () => removeItem(item.id)
    }))
  }];
  return /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: items,
    loading: loadingItems,
    onReload: onReload
  });
};