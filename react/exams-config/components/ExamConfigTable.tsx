import React from "react";
import { ConfigColumns } from "datatables.net-bs5";
import CustomDataTable from "../../components/CustomDataTable";
import { useEffect } from "react";
import { useState } from "react";
import { TableBasicActions } from "../../components/TableBasicActions";
import { ExamTypeDto } from "../../models/models";
import { useDataPagination } from "../../hooks/useDataPagination";
import { examenTypeService } from "../../../services/api";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu";
import { MenuItem } from "primereact/menuitem";
import { CustomPRTable } from "../../components/CustomPRTable";
import { PrimeReactProvider } from "primereact/api";
import { Card } from "primereact/card";

type ExamConfigTableItem = {
  id: string;
  examTypeName: string;
  description: string;
};

type ExamConfigTableProps = {
  refreshTrigger: any;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
};

export const ExamConfigTable: React.FC<ExamConfigTableProps> = ({
  refreshTrigger,
  onEditItem,
  onDeleteItem,
}) => {
  const [tableExams, setTableExams] = useState<ExamConfigTableItem[]>([]);

  const {
    data: examTypesData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: (params) => loadExamTypes(params),
    defaultPerPage: 10,
  });

  useEffect(() => {
    if (refreshTrigger > 0) {
      refresh();
    }
  }, [refreshTrigger]);

  async function loadExamTypes(params: any = { perPage: 10 }) {
    if (!params || !params.search || params.search.trim() === "") {
      delete params.search;
    }

    const backendFilters: any = {
      ...params,
      sort: "-id",
    };

    const data = await examenTypeService.examTypesFilter(backendFilters);

    return {
      data: data.data.data,
      total: data.data.total || 0,
    };
  }

  const getMenuItems = (rowData: any): MenuItem[] => [
    {
      label: "Editar",
      icon: <i className="fas fa-edit me-2"></i>,
      command: () => onEditItem(rowData.id),
    },
    {
      label: "Eliminar",
      icon: <i className="fas fa-trash me-2"></i>,
      command: () => onDeleteItem(rowData.id),
    },
  ];

  const accionesBodyTemplate = (rowData: any) => {
    return (
      <div
        className="flex align-items-center justify-content-center"
        style={{ minWidth: "120px" }}
      >
        <CustomPRTableMenu
          rowData={rowData}
          menuItems={getMenuItems(rowData)}
        />
      </div>
    );
  };

  const columns = [
    {
      field: "name",
      header: "Nombre",
      sortable: true,
      body: (rowData: any) => {
        return rowData.name || "";
      },
    },
    {
      field: "description",
      header: "Descripción",
      sortable: true,
      body: (rowData: any) => {
        return rowData.description || "";
      },
    },
    {
      field: "actions",
      header: "Acciones",
      body: accionesBodyTemplate,
      exportable: false,
      style: { minWidth: "80px", textAlign: "center" },
      width: "80px",
    },
  ];

  return (
    <PrimeReactProvider>
      <Card>
        <CustomPRTable
          columns={columns}
          data={examTypesData}
          lazy
          first={first}
          rows={perPage}
          totalRecords={totalRecords}
          loading={loadingPaginator}
          onPage={handlePageChange}
          onSearch={handleSearchChange}
          onReload={() => refresh()}
        />
      </Card>
    </PrimeReactProvider>
  );
};
