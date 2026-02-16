import React from 'react';
import { surveyService } from '../../../services/api';
import { useDataPagination } from '../../hooks/useDataPagination';
import { PrimeReactProvider } from 'primereact/api';
import { Card } from 'primereact/card';
import { CustomPRTable } from '../../components/CustomPRTable';
import { CustomPRTableMenu } from '../../components/CustomPRTableMenu';
import { MenuItem } from "primereact/menuitem";

export const SurveysList = () => {

  const {
    data: surveyData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: (params) => loadSurveys(params),
    defaultPerPage: 10,
  });

  async function loadSurveys(params: any = { perPage: 10 }) {
    const backendFilters: any = {
      ...params,
    };

    if (params.search && params.search.trim() !== "") {
      backendFilters.search = params.search.trim();
    }

    const data = await surveyService.getAllFilter(backendFilters);

    return {
      data: data.data.data,
      total: data.data.total || 0,
    };
  }

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

  const getMenuItems = (rowData: any): MenuItem[] => [
    // {
    //   label: "Editar",
    //   icon: <i className="fas fa-edit me-2"></i>,
    //   command: () => handleEditDocument(rowData.id),
    //   visible: !rowData.firmado,
    // },
    {
      label: "Ver",
      icon: <i className="fas fa-eye me-2"></i>,
    },
    {
      label: "Reenviar",
      icon: <i className="fas fa-paper-plane me-2"></i>,
    },
    {
      label: "Configurar",
      icon: <i className="fas fa-cog me-2"></i>,
    },
    {
      label: "Eliminar",
      icon: <i className="fas fa-trash me-2"></i>,
    },
  ];

  const columns = [
    { field: "id", header: "ID" },
    { field: "title", header: "Titulo" },
    { field: "description", header: "Descripcion" },
    {
      field: "createdAt",
      header: "Fecha de creacion",
      body: (rowData: any) =>
        `${new Date(rowData.created_at).toLocaleDateString()}`.slice(0, 10),
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
          data={surveyData}
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
