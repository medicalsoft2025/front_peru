import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { SplitButton } from "primereact/splitbutton";
import DepositModal from "./modal/DepositModal.js";
import { SwalManager } from "../../../services/alertManagerImported.js";
import { depositService } from "../../../services/api/index.js";
import { useDepositsComponent } from "./hooks/useDepositsComponent.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
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
  const convertDepositoToFormInputs = deposito => {
    if (!deposito) return null;
    return {
      name: deposito.attributes.name || "",
      notes: deposito.attributes.notes || "",
      type: deposito.attributes.type || ""
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
  const abrirEditarDeposito = deposito => {
    setSelectedDeposit(deposito);
    setMostrarModal(true);
  };
  const cerrarModal = () => {
    setMostrarModal(false);
    setSelectedDeposit(null);
  };

  // Eliminar depósito
  const eliminarDeposito = async id => {
    await depositService.delete(id);
    SwalManager.error({
      title: "Deposito Eliminado"
    });
    await fetchDeposits();
  };

  // Acciones para la tabla
  const createActionTemplate = (icon, label, colorClass = "") => {
    return () => /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center gap-2 p-2 point",
      style: {
        cursor: "pointer"
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: `fas fa-${icon} ${colorClass}`
    }), /*#__PURE__*/React.createElement("span", null, label));
  };
  const actionBodyTemplate = rowData => {
    const items = [{
      label: "Editar",
      template: createActionTemplate("edit", "Editar", "text-blue-500"),
      command: () => abrirEditarDeposito(rowData)
    }, {
      label: "Eliminar",
      template: createActionTemplate("trash", "Eliminar", "text-red-500"),
      command: () => eliminarDeposito(rowData.id)
    }];
    return /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement(SplitButton, {
      label: "Acciones",
      model: items,
      severity: "contrast",
      className: "p-button-sm point",
      buttonClassName: "p-button-sm",
      onClick: () => abrirEditarDeposito(rowData)
    }));
  };
  const columns = [{
    field: "attributes.name",
    header: "Nombre Deposito",
    sortable: true
  }, {
    field: "attributes.notes",
    header: "Notas",
    sortable: true
  }, {
    field: "body",
    header: "Acciones",
    body: actionBodyTemplate
  }];

  // Estilos integrados
  const styles = {
    card: {
      marginBottom: "20px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      borderRadius: "8px"
    },
    cardTitle: {
      fontSize: "1.25rem",
      fontWeight: 600,
      color: "#333"
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      color: "#495057",
      fontWeight: 600
    },
    tableCell: {
      padding: "0.75rem 1rem"
    },
    formLabel: {
      fontWeight: 500,
      marginBottom: "0.5rem",
      display: "block"
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Toast, {
    ref: saveToast
  }), /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      width: "100%",
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "flex-end",
      margin: "10px"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Nuevo Dep\xF3sito",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus me-1"
    }),
    onClick: abrirNuevoDeposito
  })), /*#__PURE__*/React.createElement(Card, {
    title: "Dep\xF3sitos",
    style: styles.card
  }, /*#__PURE__*/React.createElement(CustomPRTable, {
    data: deposits,
    columns: columns,
    loading: listLoading,
    onReload: fetchDeposits
  })), /*#__PURE__*/React.createElement(DepositModal, {
    isVisible: mostrarModal,
    onSave: async data => {
      await saveDeposit(data);
      cerrarModal();
    },
    initialData: convertDepositoToFormInputs(selectedDeposit),
    onClose: cerrarModal,
    closable: true,
    loading: saveLoading
  })));
};