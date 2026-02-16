import React, { useEffect, useState, useCallback } from "react";
import { PrimeReactProvider } from "primereact/api";
import { BranchTable } from "../../../fe-config/company/branch/table/BranchTable";
import { BranchFormModal } from "../../../fe-config/company/branch/modal/BranchFormModal";
import { branchService } from "../../../../services/api";
import { SwalManager } from "../../../../services/alertManagerImported";
// We don't use useBranch hook from fe-config because it might be global or tied to something else.
// We write our own simple logic here.

interface CompanyBranchesTabProps {
    companyId?: number;
}

export const CompanyBranchesTab: React.FC<CompanyBranchesTabProps> = ({ companyId }) => {
    const [branches, setBranches] = useState<any[]>([]);
    const [showBranchFormModal, setShowBranchFormModal] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);
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

    const handleSubmit = async (data: any) => {
        if (!companyId) return;
        try {
            // Inject company_id
            const payload = { ...data, company_id: companyId };

            if (initialData && initialData.id) {
                await branchService.update(initialData.id, payload);
                SwalManager.success({ title: "Sede actualizada" });
            } else {
                await branchService.create(payload);
                SwalManager.success({ title: "Sede creada" });
            }
            setShowBranchFormModal(false);
            fetchBranches();
        } catch (error) {
            console.error("Error creating/updating branch: ", error);
            SwalManager.error({ title: "Error al guardar sede" });
        }
    };

    const handleTableEdit = async (id: string) => {
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

    const handleDeleteItem = async (id: string) => {
        await SwalManager.confirmDelete(async () => {
            try {
                await branchService.delete(id);
                SwalManager.success({ title: "Sede eliminada" });
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
        return <div className="alert alert-warning">Guarde la empresa para gestionar sus sedes.</div>;
    }

    return (
        <PrimeReactProvider>
            <div className="container-fluid mt-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 className="mb-1">Gestión de Sucursales</h4>
                        <small className="text-muted">
                            {branches.length > 0
                                ? `${branches.length} sede(s) configurada(s)`
                                : 'Crea al menos una sede.'
                            }
                        </small>
                    </div>

                    <div className="text-end">
                        <button
                            className="btn btn-primary d-flex align-items-center"
                            onClick={onCreate}
                        >
                            <i className="fas fa-plus me-2"></i>
                            Nueva Sede
                        </button>
                    </div>
                </div>

                <BranchTable
                    branches={branches}
                    onEditItem={handleTableEdit}
                    onDeleteItem={handleDeleteItem}
                    loading={loading}
                />

                <BranchFormModal
                    title={initialData ? "Editar Sede" : "Crear Sede"}
                    show={showBranchFormModal}
                    handleSubmit={handleSubmit}
                    onHide={handleHideBranchFormModal}
                    initialData={initialData}
                    loading={loading}
                />
            </div>
        </PrimeReactProvider>
    );
};
