import React, { useEffect, useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useForm, useFieldArray } from 'react-hook-form';
import { useCreateTransfer } from "../hooks/useCreateTransfer.js";
import { useDeposits } from "../../deposits/hooks/useDeposits.js";
import { TransferRow } from "./TransferRow.js";
export const InventoryTransferModal = ({
  visible,
  onHide,
  onSuccess
}) => {
  const {
    deposits,
    loading: loadingDeposits
  } = useDeposits();
  const {
    createTransfer,
    loading: submitting
  } = useCreateTransfer();

  // Global destination control state
  const [globalDestinationId, setGlobalDestinationId] = useState(null);
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {
      errors
    }
  } = useForm({
    defaultValues: {
      transfers: [{
        source_deposit_id: 0,
        destination_deposit_id: 0,
        product_id: 0,
        quantity: 1,
        lot_id: null,
        source_lot_id: null,
        destination_lot_id: null
      }]
    }
  });
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: "transfers"
  });

  // Watch all fields to calculate used stock in real-time
  const currentTransfers = watch('transfers');

  // Callback to get used stock for a specific product/lot EXCLUDING the current row
  // This allows the current row to see how much is used by OTHERS to subtract from total
  const getUsedStock = useCallback((productId, lotId, rowIndex) => {
    let used = 0;
    currentTransfers.forEach((transfer, index) => {
      if (index !== rowIndex && transfer.product_id === productId) {
        // If product matches:
        // 1. If lotId is provided (lot managed), both must match lot_id
        // 2. If lotId is null (not lot managed), just product match is enough
        if (lotId) {
          // Check if transfer.source_lot_id matches (using source_lot_id as primary for source)
          // Note: In logic we use source_lot_id for source lot usually
          if (transfer.source_lot_id === lotId) {
            used += transfer.quantity || 0;
          }
        } else {
          used += transfer.quantity || 0;
        }
      }
    });
    return used;
  }, [currentTransfers]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!visible) {
      reset({
        transfers: [{
          source_deposit_id: 0,
          destination_deposit_id: 0,
          product_id: 0,
          quantity: 1,
          lot_id: null,
          source_lot_id: null,
          destination_lot_id: null
        }]
      });
      setGlobalDestinationId(null);
    }
  }, [visible, reset]);
  const onSubmit = async data => {
    try {
      await createTransfer(data);
      onSuccess();
      onHide();
    } catch (error) {
      console.error("Transfer failed", error);
    }
  };
  const handleApplyGlobalDestination = () => {
    if (globalDestinationId) {
      fields.forEach((_, index) => {
        setValue(`transfers.${index}.destination_deposit_id`, globalDestinationId);
        setValue(`transfers.${index}.destination_lot_id`, null);
      });
    }
  };
  const depositOptions = deposits.map(d => ({
    label: d.attributes.name,
    value: d.id
  }));

  // Determine modal width based on screen size (responsive)
  // Using a class or style for width

  const dialogFooter = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar xd",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-times me-2"
    }),
    onClick: onHide,
    className: "p-button-text"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Transferir",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-exchange-alt me-2"
    }),
    onClick: handleSubmit(onSubmit),
    autoFocus: true
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Realizar Traslado de Inventario",
    visible: visible,
    style: {
      width: '90vw',
      maxWidth: '1200px'
    },
    footer: dialogFooter,
    onHide: onHide,
    maximized: false,
    className: "inventory-transfer-modal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row mb-4 align-items-end p-3 bg-light rounded shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6 col-lg-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label fw-bold"
  }, "Pre-seleccionar Destino (Opcional)"), /*#__PURE__*/React.createElement(Dropdown, {
    value: globalDestinationId,
    options: depositOptions,
    onChange: e => setGlobalDestinationId(e.value),
    placeholder: "Seleccione un destino para todos",
    filter: true,
    className: "w-100",
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-4 col-lg-3 mt-2 mt-md-0"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar a todos",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check-double me-2"
    }),
    onClick: handleApplyGlobalDestination,
    disabled: !globalDestinationId,
    className: "p-button-secondary w-100"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "transfer-rows-container"
  }, fields.map((field, index) => /*#__PURE__*/React.createElement(TransferRow, {
    key: field.id,
    index: index,
    control: control,
    setValue: setValue,
    watch: watch,
    remove: remove,
    deposits: deposits,
    isOnlyRow: fields.length === 1,
    getUsedStock: getUsedStock
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 text-center"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Agregar \xCDtem",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-plus me-2"
    }),
    onClick: () => append({
      source_deposit_id: 0,
      destination_deposit_id: globalDestinationId || 0,
      product_id: 0,
      quantity: 1,
      lot_id: null,
      source_lot_id: null,
      destination_lot_id: null
    }),
    className: "p-button-outlined w-100 p-3",
    style: {
      borderStyle: 'dashed'
    }
  })), Object.keys(errors).length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger mt-3"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-exclamation-circle me-2"
  }), "Por favor corrija los errores en las filas marcadas.")));
};