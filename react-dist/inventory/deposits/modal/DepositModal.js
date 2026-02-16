import React, { useState } from "react";
import { CustomModal } from "../../../components/CustomModal.js";
import DepositForm from "../form/DepositForm.js";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
const DepositModal = ({
  isVisible,
  onSave,
  initialData,
  onClose,
  closable = true,
  loading = false
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
  const modalTitle = initialData && initialData.name ? `Editar Depósito - ${initialData.name}` : "Nuevo Depósito";
  const formId = "depositForm";
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(CustomModal, {
    show: isVisible,
    onHide: handleCloseAttempt,
    title: modalTitle,
    footerTemplate: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-times me-1"
      }),
      severity: "secondary",
      onClick: handleCloseAttempt,
      disabled: loading
    }), /*#__PURE__*/React.createElement(Button, {
      type: "submit",
      label: "Guardar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-save me-1"
      }),
      form: formId,
      disabled: loading
    }))
  }, /*#__PURE__*/React.createElement(DepositForm, {
    formId: formId,
    onSubmit: onSave,
    initialData: initialData || undefined
  })), /*#__PURE__*/React.createElement(Dialog, {
    visible: showConfirm,
    onHide: () => setShowConfirm(false),
    header: "Confirmar",
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-end align-items-center gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      label: "No",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-times me-1"
      }),
      onClick: () => setShowConfirm(false)
    }), /*#__PURE__*/React.createElement(Button, {
      label: "S\xED, descartar",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-check me-1"
      }),
      severity: "danger",
      onClick: handleConfirmClose
    }))
  }, /*#__PURE__*/React.createElement("p", null, "\xBFEst\xE1s seguro que deseas descartar los cambios?")));
};
export default DepositModal;