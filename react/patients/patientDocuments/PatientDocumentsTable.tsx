import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { patientDocumentsService } from "../../../services/api";
import { Toast } from "primereact/toast";
import { PrimeReactProvider } from "primereact/api";
import { CustomPRTable } from "../../components/CustomPRTable";
import { useDataPagination } from "../../hooks/useDataPagination";
import { Image } from "primereact/image";
import { MenuItem } from "primereact/menuitem";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu";

export const PatientDocumentsTable: React.FC<any> = ({
  refreshData = false,
  onHandleEdit = () => {},
}) => {
  const toast = useRef<Toast>(null);

  const {
    data: patientDocuments,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh,
  } = useDataPagination({
    fetchFunction: (params) => loadPatientDocuments(params),
    defaultPerPage: 10,
  });

  useEffect(() => {
    if (refreshData) {
      refresh();
    }
  }, [refreshData]);

  async function loadPatientDocuments(params: any = { perPage: 10 }) {
    if (params.search === "") {
      delete params.search;
    }

    const data = await patientDocumentsService.getAllFilter(params);

    return {
      data: data.data,
      total: data.total || 0,
    };
  }

  async function handleEditDocument(id: number) {
    const documentData = await patientDocumentsService.get(id);
    onHandleEdit(documentData);
  }

  async function handleDeleteDocument(id: number) {
    const responseDelete = await patientDocumentsService.delete(id);
    refresh();
    toast.current?.show({
      severity: "warn",
      summary: "Éxito",
      detail: "Documento del paciente eliminado correctamente",
      life: 3000,
    });
  }

  const getMenuItems = (rowData: any): MenuItem[] => [
    {
      label: "Editar",
      icon: <i className="fas fa-edit me-2"></i>,
      command: () => handleEditDocument(rowData.id),
    },
    {
      label: "Eliminar",
      icon: <i className="fas fa-trash me-2"></i>,
      command: () => handleDeleteDocument(rowData.id),
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
      field: "id",
      header: "Id",
      sortable: true,
    },
    {
      field: "name",
      header: "Nombre del documento",
      sortable: true,
      body: (rowData: any) => {
        return rowData.name;
      },
    },
    {
      field: "Image",
      header: "Documento",
      sortable: true,
      body: (rowData: any) => {
        const typeFile = rowData.minio_url.slice(-3);
        switch (typeFile) {
          case "pdf":
            return (
              <div className="d-flex flex justify-content-center">
                <a
                  className="text-center"
                  href={rowData.minio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-solid fa-file-pdf fa-2x text-danger"></i>
                  <h3>Ver PDF</h3>
                </a>
              </div>
            );
          case "png":
          case "jpg":
            return (
              <div className="d-flex flex justify-content-center">
                <Image
                  src={rowData.minio_url}
                  zoomSrc={rowData.minio_url}
                  alt="Image"
                  width="80"
                  height="60"
                  preview
                />
              </div>
            );
        }
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
          data={patientDocuments}
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
      <Toast ref={toast} />
    </PrimeReactProvider>
  );
};
