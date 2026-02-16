import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal";
import DepositForm from "../form/DepositForm";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { DepositModalProps } from "../ts/depositModalType";

const DepositModal: React.FC<DepositModalProps> = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  loading = false,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCloseAttempt = () => {
    if (closable) {
      setShowConfirm(true);
    }
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    onClose();
  };

  // Determinar el título basado en si hay initialData (edición) o no (nuevo)
  const modalTitle =
    initialData && initialData.name
      ? `Editar Depósito - ${initialData.name}`
      : "Nuevo Depósito";

  const formId = "depositForm";

  return (
    <>
      <CustomModal
        show={isVisible}
        onHide={handleCloseAttempt}
        title={modalTitle}
        footerTemplate={
          <div className="d-flex justify-content-end align-items-center gap-2">
            <Button
              label="Cancelar"
              icon={<i className="fa fa-times me-1"></i>}
              severity="secondary"
              onClick={handleCloseAttempt}
              disabled={loading}
            />
            <Button
              type="submit"
              label="Guardar"
              icon={<i className="fa fa-save me-1"></i>}
              form={formId}
              disabled={loading}
            />
          </div>
        }
      >
        <DepositForm
          formId={formId}
          onSubmit={onSave}
          initialData={initialData || undefined}
        />
      </CustomModal>

      <Dialog
        visible={showConfirm}
        onHide={() => setShowConfirm(false)}
        header="Confirmar"
        footer={
          <div className="d-flex justify-content-end align-items-center gap-2">
            <Button
              label="No"
              icon={<i className="fa fa-times me-1"></i>}
              onClick={() => setShowConfirm(false)}
            />
            <Button
              label="Sí, descartar"
              icon={<i className="fa fa-check me-1"></i>}
              severity="danger"
              onClick={handleConfirmClose}
            />
          </div>
        }
      >
        <p>¿Estás seguro que deseas descartar los cambios?</p>
      </Dialog>
    </>
  );
};

export default DepositModal;
