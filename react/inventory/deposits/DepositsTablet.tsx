import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { SplitButton } from "primereact/splitbutton";
import { Deposito } from "./ts/depositsType";
import DepositModal from "./modal/DepositModal";
import { DepositFormInputs } from "./ts/depositFormType";
import { SwalManager } from "../../../services/alertManagerImported";
import { depositService } from "../../../services/api";
import { useDepositsComponent } from "./hooks/useDepositsComponent";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { Toast } from "primereact/toast";
export const DepositsTablet = () => {
  const [mostrarModal, setMostrarModal] = useState(false);

  const {
    deposits,
    fetchDeposits,
    saveDeposit,
    selectedDeposit,
    setSelectedDeposit,
    listLoading,
    saveLoading,
    saveToast
  } = useDepositsComponent();

  const convertDepositoToFormInputs = (
    deposito: Partial<any>
  ): DepositFormInputs | null => {
    if (!deposito) return null;

    return {
      name: deposito.attributes.name || "",
      notes: deposito.attributes.notes || "",
      type: deposito.attributes.type || "",
    };
  };

  // Simular carga de datos
  useEffect(() => {
    fetchDeposits();
  }, []);

  const abrirNuevoDeposito = () => {
    setSelectedDeposit(null);
    setMostrarModal(true);
  };

  const abrirEditarDeposito = (deposito: Deposito) => {
    setSelectedDeposit(deposito);
    setMostrarModal(true);
  };
  const cerrarModal = () => {
    setMostrarModal(false);
    setSelectedDeposit(null);
  };

  // Eliminar depósito
  const eliminarDeposito = async (id: number) => {
    await depositService.delete(id);
    SwalManager.error({
      title: "Deposito Eliminado",
    });
    await fetchDeposits();
  };

  // Acciones para la tabla
  const createActionTemplate = (
    icon: string,
    label: string,
    colorClass: string = ""
  ) => {
    return () => (
      <div
        className="flex align-items-center gap-2 p-2 point"
        style={{ cursor: "pointer" }}
      >
        <i className={`fas fa-${icon} ${colorClass}`} />
        <span>{label}</span>
      </div>
    );
  };

  const actionBodyTemplate = (rowData: Deposito) => {
    const items = [
      {
        label: "Editar",
        template: createActionTemplate("edit", "Editar", "text-blue-500"),
        command: () => abrirEditarDeposito(rowData),
      },
      {
        label: "Eliminar",
        template: createActionTemplate("trash", "Eliminar", "text-red-500"),
        command: () => eliminarDeposito(rowData.id),
      },
    ];

    return (
      <div className="flex gap-2">
        <SplitButton
          label="Acciones"
          model={items}
          severity="contrast"
          className="p-button-sm point"
          buttonClassName="p-button-sm"
          onClick={() => abrirEditarDeposito(rowData)}
        />
      </div>
    );
  };

  const columns: CustomPRTableColumnProps[] = [
    {
      field: "attributes.name",
      header: "Nombre Deposito",
      sortable: true,
    },
    {
      field: "attributes.notes",
      header: "Notas",
      sortable: true,
    },
    {
      field: "body",
      header: "Acciones",
      body: actionBodyTemplate,
    },
  ];

  // Estilos integrados
  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px",
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600,
    },
    tableCell: {
      padding: "0.75rem 1rem",
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block",
    },
  };

  return (<>
    <Toast ref={saveToast} />
    <div
      className="container-fluid mt-4"
      style={{ width: "100%", padding: "0 15px" }}
    >
      <div
        style={{ display: "flex", justifyContent: "flex-end", margin: "10px" }}
      >
        <Button
          label="Nuevo Depósito"
          icon={<i className="fa fa-plus me-1"></i>}
          onClick={abrirNuevoDeposito}
        />
      </div>

      {/* Tabla de depósitos */}
      <Card title="Depósitos" style={styles.card}>
        <CustomPRTable
          data={deposits}
          columns={columns}
          loading={listLoading}
          onReload={fetchDeposits}
        />
      </Card>

      <DepositModal
        isVisible={mostrarModal}
        onSave={async (data: DepositFormInputs) => {
          await saveDeposit(data)
          cerrarModal()
        }}
        initialData={convertDepositoToFormInputs(selectedDeposit)}
        onClose={cerrarModal}
        closable={true}
        loading={saveLoading}
      />
    </div>
  </>)
};
