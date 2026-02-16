import React, { useEffect, useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { BranchTable } from "./table/BranchTable.js";
import { BranchFormModal } from "./modal/BranchFormModal.js";
import { branchService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js";
import { useBranch } from "./hooks/useBranch.js";
export const BranchApp = ({
  companyId,
  onValidationChange
}) => {
  const {
    branch,
    setBranch,
    fetchBranchHook
  } = useBranch();
  const [branches, setBranches] = useState([]);
  const [showBranchFormModal, setShowBranchFormModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  useEffect(() => {
    fetchBranches();
  }, [companyId]);
  useEffect(() => {
    if (branch) {
      setInitialData({
        name: branch?.name,
        email: branch?.email,
        phone: branch?.phone,
        address: branch?.address,
        city: branch?.city,
        country: branch?.country,
        isEditing: true,
        id: branch.id
      });
    }
  }, [branch]);

  // Validar si hay al menos una sede creada
  useEffect(() => {
    const isValid = branches && branches.length > 0;
    console.log('🏢 Validación Sedes - Branches:', branches.length, 'IsValid:', isValid);
    onValidationChange?.(isValid);
  }, [branches, onValidationChange]);
  const onCreate = () => {
    setInitialData(undefined);
    setShowBranchFormModal(true);
  };
  const handleSubmit = async data => {
    try {
      const payload = {
        ...data,
        company_id: companyId
      };
      if (branch) {
        await branchService.update(branch?.id, payload);
        SwalManager.success({
          title: "Sede actualizada"
        });
      } else {
        await branchService.create(payload);
        SwalManager.success({
          title: "Sede creada"
        });
      }
    } catch (error) {
      console.error("Error creating/updating branch: ", error);
    } finally {
      setShowBranchFormModal(false);
      await fetchBranches();
    }
  };
  const handleHideBranchFormModal = () => {
    setShowBranchFormModal(false);
    setBranch(null);
  };
  const handleTableEdit = id => {
    fetchBranchHook(id);
    setShowBranchFormModal(true);
  };
  const handleDeleteItem = async id => {
    try {
      await branchService.delete(id);
      SwalManager.success({
        title: "Sede eliminada"
      });
      await fetchBranches();
    } catch (error) {
      console.error("Error deleting branch: ", error);
    }
  };
  async function fetchBranches() {
    try {
      let response;
      if (companyId) {
        // @ts-ignore - branchService is typed as BaseApiService but we added getByCompany
        response = await branchService.getByCompany(companyId);
      } else {
        response = await branchService.getAll();
      }
      setBranches(response);
      console.log('📊 Sedes cargadas:', response.length);
    } catch (error) {
      console.error("Error fetching branches: ", error);
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(PrimeReactProvider, {
    value: {
      appendTo: "self",
      zIndex: {
        overlay: 100000
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: '13px'
    },
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Gesti\xF3n de Sucursales"), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, branches.length > 0 ? `${branches.length} sede(s) configurada(s)` : 'Crea al menos una sede para completar este módulo')), /*#__PURE__*/React.createElement("div", {
    className: "text-end",
    style: {
      marginRight: '12px'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nueva Sede"))), /*#__PURE__*/React.createElement(BranchTable, {
    branches: branches,
    onEditItem: handleTableEdit,
    onDeleteItem: handleDeleteItem
  }), /*#__PURE__*/React.createElement(BranchFormModal, {
    title: branch ? "Editar Sede" : "Crear Sede",
    show: showBranchFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideBranchFormModal,
    initialData: initialData
  })));
};