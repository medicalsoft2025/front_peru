import React, { useState } from "react";
import { PrimeReactProvider } from "primereact/api";
import { useEffect } from "react";
import { ExamConfigTable } from "./components/ExamConfigTable";
import { useExamTypes } from "./hooks/useExamTypes";
import { useExamTypeCreate } from "./hooks/useExamTypeCreate";
import { useExamTypeUpdate } from "./hooks/useExamTypeUpdate";
import { useExamTypeDelete } from "./hooks/useExamTypeDelete";
import { useExamType } from "./hooks/useExamType";
import { ExamTypeInputs } from "./components/ExamConfigForm";
import { ExamConfigFormModal } from "./components/ExamConfigFormModal";

export const ExamConfigApp = () => {
  const [showExamTypeFormModal, setShowExamTypeFormModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [initialData, setInitialData] = useState<ExamTypeInputs | undefined>(
    undefined,
  );

  const { examTypes, fetchExamTypes } = useExamTypes();
  const { createExamType } = useExamTypeCreate();
  const { updateExamType } = useExamTypeUpdate();
  const { deleteExamType } = useExamTypeDelete();
  const { examType, setExamType, fetchExamType } = useExamType();

  const onCreate = () => {
    setInitialData(undefined);
    setExamType(null);
    setShowExamTypeFormModal(true);
  };

  const handleSubmit = async (data: ExamTypeInputs) => {
    const mappedData: ExamTypeInputs = {
      ...data,
      form_config: data.form_config || {},
    };

    if (examType) {
      await updateExamType(examType.id, mappedData);
    } else {
      await createExamType(mappedData);
    }
    fetchExamTypes();
    setShowExamTypeFormModal(false);
setRefreshTrigger(prev => prev + 1);
  };

  const handleTableEdit = (id: string) => {
    fetchExamType(id);
    setShowExamTypeFormModal(true);
  };

  const handleTableDelete = async (id: string) => {
    const confirmed = await deleteExamType(id);
    if (confirmed) fetchExamTypes();
setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    setInitialData({
      name: examType?.name ?? "",
      description: examType?.description ?? "",
      type: examType?.type ?? "",
      form_config: examType?.form_config ?? null,
    });
  }, [examType]);

  return (
    <>
      <PrimeReactProvider
        value={{
          appendTo: "self",
          zIndex: {
            overlay: 100000,
          },
        }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-1">Exámenes</h4>
          <div className="text-end mb-2">
            <button className="btn btn-primary" onClick={onCreate}>
              <i className="fas fa-plus"></i> Nuevo
            </button>
          </div>
        </div>
        <ExamConfigTable
          refreshTrigger={refreshTrigger}
          onEditItem={handleTableEdit}
          onDeleteItem={handleTableDelete}
        ></ExamConfigTable>
        <ExamConfigFormModal
          title={examType ? "Editar exámen" : "Crear exámen"}
          show={showExamTypeFormModal}
          handleSubmit={handleSubmit}
          onHide={() => {
            setShowExamTypeFormModal(false);
          }}
          initialData={initialData}
        ></ExamConfigFormModal>
      </PrimeReactProvider>
    </>
  );
};
