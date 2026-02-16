import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { examenTypeService } from "../../../services/api/index.js";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";
export const ExamConfigTable = ({
  refreshTrigger,
  onEditItem,
  onDeleteItem
}) => {
  const [tableExams, setTableExams] = useState([]);
  const {
    data: examTypesData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: params => loadExamTypes(params),
    defaultPerPage: 10
  });
  useEffect(() => {
    if (refreshTrigger > 0) {
      refresh();
    }
  }, [refreshTrigger]);
  async function loadExamTypes(params = {
    perPage: 10
  }) {
    if (!params || !params.search || params.search.trim() === "") {
      delete params.search;
    }
    const backendFilters = {
      ...params,
      sort: "-id"
    };
    const data = await examenTypeService.examTypesFilter(backendFilters);
    return {
      data: data.data.data,
      total: data.data.total || 0
    };
  }
  const getMenuItems = rowData => [{
    label: "Editar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-edit me-2"
    }),
    command: () => onEditItem(rowData.id)
  }, {
    label: "Eliminar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash me-2"
    }),
    command: () => onDeleteItem(rowData.id)
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
    field: "name",
    header: "Nombre",
    sortable: true,
    body: rowData => {
      return rowData.name || "";
    }
  }, {
    field: "description",
    header: "Descripción",
    sortable: true,
    body: rowData => {
      return rowData.description || "";
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
    data: examTypesData,
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