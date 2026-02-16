import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
export const TicketsList = ({
  onNewTicket
}) => {
  // Mock data
  const [tickets, setTickets] = useState([{
    id: 1,
    subject: "Error en login",
    frequency: "Siempre",
    status: "Abierto",
    created_at: "2023-10-27"
  }, {
    id: 2,
    subject: "Pantalla blanca en reportes",
    frequency: "A veces",
    status: "En Proceso",
    created_at: "2023-10-26"
  }]);
  const statusBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("span", {
      className: `badge ${rowData.status === 'Abierto' ? 'bg-danger' : 'bg-success'}`
    }, rowData.status);
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement(Button, {
      icon: "pi pi-search",
      className: "p-button-rounded p-button-text",
      "aria-label": "Ver"
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-content-between mb-3"
  }, /*#__PURE__*/React.createElement("h3", null, "Listado de Tickets"), /*#__PURE__*/React.createElement(Button, {
    label: "Crear Ticket",
    icon: "pi pi-plus",
    className: "p-button-success",
    onClick: onNewTicket
  })), /*#__PURE__*/React.createElement(DataTable, {
    value: tickets,
    paginator: true,
    rows: 10,
    emptyMessage: "No hay tickets encontrados."
  }, /*#__PURE__*/React.createElement(Column, {
    field: "id",
    header: "ID",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "subject",
    header: "Asunto",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "frequency",
    header: "Frecuencia",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "created_at",
    header: "Fecha Creaci\xF3n",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "status",
    header: "Estado",
    body: statusBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    exportable: false,
    style: {
      minWidth: '8rem'
    }
  })));
};