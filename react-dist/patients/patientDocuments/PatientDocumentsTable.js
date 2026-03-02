import React, { useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { patientDocumentsService } from "../../../services/api/index.js";
import { Toast } from "primereact/toast";
import { PrimeReactProvider } from "primereact/api";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { Image } from "primereact/image";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu.js";
export const PatientDocumentsTable = ({
  refreshData = false,
  onHandleEdit = () => {}
}) => {
  const toast = useRef(null);
  const {
    data: patientDocuments,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: params => loadPatientDocuments(params),
    defaultPerPage: 10
  });
  useEffect(() => {
    if (refreshData) {
      refresh();
    }
  }, [refreshData]);
  async function loadPatientDocuments(params = {
    perPage: 10
  }) {
    if (params.search === "") {
      delete params.search;
    }
    const data = await patientDocumentsService.getAllFilter(params);
    return {
      data: data.data,
      total: data.total || 0
    };
  }
  async function handleEditDocument(id) {
    const documentData = await patientDocumentsService.get(id);
    onHandleEdit(documentData);
  }
  async function handleDeleteDocument(id) {
    const responseDelete = await patientDocumentsService.delete(id);
    refresh();
    toast.current?.show({
      severity: "warn",
      summary: "Éxito",
      detail: "Documento del paciente eliminado correctamente",
      life: 3000
    });
  }
  const getMenuItems = rowData => [{
    label: "Editar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-edit me-2"
    }),
    command: () => handleEditDocument(rowData.id)
  }, {
    label: "Eliminar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash me-2"
    }),
    command: () => handleDeleteDocument(rowData.id)
  }];
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(CustomPRTableMenu, {
      rowData: rowData,
      menuItems: getMenuItems(rowData)
    }));
  };
  const columns = [{
    field: "id",
    header: "Id",
    sortable: true
  }, {
    field: "name",
    header: "Nombre del documento",
    sortable: true,
    body: rowData => {
      return rowData.name;
    }
  }, {
    field: "Image",
    header: "Documento",
    sortable: true,
    body: rowData => {
      const typeFile = rowData.minio_url.slice(-3);
      switch (typeFile) {
        case "pdf":
          return /*#__PURE__*/React.createElement("div", {
            className: "d-flex flex justify-content-center"
          }, /*#__PURE__*/React.createElement("a", {
            className: "text-center",
            href: rowData.minio_url,
            target: "_blank",
            rel: "noopener noreferrer"
          }, /*#__PURE__*/React.createElement("i", {
            className: "fa-solid fa-file-pdf fa-2x text-danger"
          }), /*#__PURE__*/React.createElement("h3", null, "Ver PDF")));
        case "png":
        case "jpg":
          return /*#__PURE__*/React.createElement("div", {
            className: "d-flex flex justify-content-center"
          }, /*#__PURE__*/React.createElement(Image, {
            src: rowData.minio_url,
            zoomSrc: rowData.minio_url,
            alt: "Image",
            width: "80",
            height: "60",
            preview: true
          }));
      }
    }
  }, {
    field: "actions",
    header: "Acciones",
    body: accionesBodyTemplate,
    exportable: false,
    style: {
      minWidth: "80px",
      textAlign: "center"
    },
    width: "80px"
  }];
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: patientDocuments,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPaginator,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: () => refresh()
  })), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};