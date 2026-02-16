import React, { useEffect, useState, useCallback } from "react";
import { PrimeReactProvider } from "primereact/api";
import { BranchTable } from "../../../fe-config/company/branch/table/BranchTable.js";
import { BranchFormModal } from "../../../fe-config/company/branch/modal/BranchFormModal.js";
import { branchService } from "../../../../services/api/index.js";
import { SwalManager } from "../../../../services/alertManagerImported.js"; // We don't use useBranch hook from fe-config because it might be global or tied to something else.
// We write our own simple logic here.
export const CompanyBranchesTab = ({
  companyId
}) => {
  const [branches, setBranches] = useState([]);
  const [showBranchFormModal, setShowBranchFormModal] = useState(false);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch branches filtered by company
  const fetchBranches = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      // Using the query string support added to BaseApiService
      const response = await branchService.getAll(`?company_id=${companyId}`);
      setBranches(response);
    } catch (error) {
      console.error("Error fetching branches: ", error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);
  const onCreate = () => {
    setInitialData(undefined);
    setShowBranchFormModal(true);
  };
  const handleSubmit = async data => {
    if (!companyId) return;
    try {
      // Inject company_id
      const payload = {
        ...data,
        company_id: companyId
      };
      if (initialData && initialData.id) {
        await branchService.update(initialData.id, payload);
        SwalManager.success({
          title: "Sede actualizada"
        });
      } else {
        await branchService.create(payload);
        SwalManager.success({
          title: "Sede creada"
        });
      }
      setShowBranchFormModal(false);
      fetchBranches();
    } catch (error) {
      console.error("Error creating/updating branch: ", error);
      SwalManager.error({
        title: "Error al guardar sede"
      });
    }
  };
  const handleTableEdit = async id => {
    setLoading(true);
    try {
      const data = await branchService.get(id);
      setInitialData({
        ...data,
        isEditing: true
      });
      setShowBranchFormModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteItem = async id => {
    await SwalManager.confirmDelete(async () => {
      try {
        await branchService.delete(id);
        SwalManager.success({
          title: "Sede eliminada"
        });
        fetchBranches();
      } catch (error) {
        console.error("Error deleting branch: ", error);
      }
    });
  };
  const handleHideBranchFormModal = () => {
    setShowBranchFormModal(false);
    setInitialData(null);
  };
  if (!companyId) {
    return /*#__PURE__*/React.createElement("div", {
      className: "alert alert-warning"
    }, "Guarde la empresa para gestionar sus sedes.");
  }
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-4"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    className: "mb-1"
  }, "Gesti\xF3n de Sucursales"), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, branches.length > 0 ? `${branches.length} sede(s) configurada(s)` : 'Crea al menos una sede.')), /*#__PURE__*/React.createElement("div", {
    className: "text-end"
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary d-flex align-items-center",
    onClick: onCreate
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-plus me-2"
  }), "Nueva Sede"))), /*#__PURE__*/React.createElement(BranchTable, {
    branches: branches,
    onEditItem: handleTableEdit,
    onDeleteItem: handleDeleteItem,
    loading: loading
  }), /*#__PURE__*/React.createElement(BranchFormModal, {
    title: initialData ? "Editar Sede" : "Crear Sede",
    show: showBranchFormModal,
    handleSubmit: handleSubmit,
    onHide: handleHideBranchFormModal,
    initialData: initialData,
    loading: loading
  })));
};