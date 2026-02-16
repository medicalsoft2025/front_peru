import React from 'react';
import { surveyService } from "../../../services/api/index.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { PrimeReactProvider } from 'primereact/api';
import { Card } from 'primereact/card';
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu.js";
export const SurveysList = () => {
  const {
    data: surveyData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: params => loadSurveys(params),
    defaultPerPage: 10
  });
  async function loadSurveys(params = {
    perPage: 10
  }) {
    const backendFilters = {
      ...params
    };
    if (params.search && params.search.trim() !== "") {
      backendFilters.search = params.search.trim();
    }
    const data = await surveyService.getAllFilter(backendFilters);
    return {
      data: data.data.data,
      total: data.data.total || 0
    };
  }
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
  const getMenuItems = rowData => [
  // {
  //   label: "Editar",
  //   icon: <i className="fas fa-edit me-2"></i>,
  //   command: () => handleEditDocument(rowData.id),
  //   visible: !rowData.firmado,
  // },
  {
    label: "Ver",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-eye me-2"
    })
  }, {
    label: "Reenviar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-paper-plane me-2"
    })
  }, {
    label: "Configurar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-cog me-2"
    })
  }, {
    label: "Eliminar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash me-2"
    })
  }];
  const columns = [{
    field: "id",
    header: "ID"
  }, {
    field: "title",
    header: "Titulo"
  }, {
    field: "description",
    header: "Descripcion"
  }, {
    field: "createdAt",
    header: "Fecha de creacion",
    body: rowData => `${new Date(rowData.created_at).toLocaleDateString()}`.slice(0, 10)
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
    data: surveyData,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPaginator,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: () => refresh()
  })));
};