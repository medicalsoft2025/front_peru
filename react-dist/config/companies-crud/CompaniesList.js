import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
export const CompaniesList = ({
  data,
  loading,
  onEdit,
  onDelete,
  onReload
}) => {
  const logoBodyTemplate = rowData => {
    if (!rowData.logo) return null;
    let imageUrl = rowData.logo_minio_url;
    if (!imageUrl.startsWith('http')) {
      // Basic handling, assuming relative path needs storage prefix if not present
      // This mimics what was seen in GeneralInfoTab but strictly we might need a helper
      // For now, we display it simply. If it's a file path, we might need the full URL logic.
      // We'll just show the path text if image fails or nothing if intricate.
      // Actually, let's try to render it if it looks like a path.
      const baseUrl = "https://dev.monaros.co/storage/"; // Fallback based on GeneralInfoTab
      imageUrl = `${baseUrl}${rowData.logo.replaceAll("\\", "/")}`;
    }
    return /*#__PURE__*/React.createElement("img", {
      src: imageUrl,
      alt: rowData.legal_name,
      style: {
        width: '50px',
        height: '50px',
        objectFit: 'contain'
      },
      onError: e => e.currentTarget.style.display = 'none'
    });
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-pen-to-square"
      }),
      className: "p-button-text p-button-warning",
      onClick: () => onEdit(rowData),
      tooltip: "Editar"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-trash"
      }),
      className: "p-button-text p-button-danger",
      onClick: () => onDelete(rowData),
      tooltip: "Eliminar"
    }));
  };
  const refreshHeader = () => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex justify-content-end"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa-solid fa-sync"
      }),
      onClick: onReload,
      tooltip: "Recargar"
    }));
  };
  return /*#__PURE__*/React.createElement(DataTable, {
    value: data,
    loading: loading,
    paginator: true,
    rows: 10,
    header: refreshHeader(),
    emptyMessage: "No se encontraron empresas",
    className: "p-datatable-sm"
  }, /*#__PURE__*/React.createElement(Column, {
    header: "Logo",
    body: logoBodyTemplate,
    style: {
      width: '10%'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "legal_name",
    header: "Nombre Comercial",
    sortable: true,
    filter: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "document_number",
    header: "Documento",
    sortable: true,
    filter: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "phone",
    header: "Tel\xE9fono",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "email",
    header: "Correo",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "city",
    header: "Ciudad",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    header: "Acciones",
    style: {
      width: '10%',
      textAlign: 'center'
    }
  }));
};