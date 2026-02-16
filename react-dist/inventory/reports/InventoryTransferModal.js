function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import React, { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { useForm, Controller } from 'react-hook-form';
import { useDeposits } from "../../deposits/hooks/useDeposits.js";
import { useTransferProducts } from "./hooks/useTransferProducts.js";
import { useTransferLots } from "./hooks/useTransferLots.js";
import { useCreateTransfer } from "./hooks/useCreateTransfer.js";
export const InventoryTransferModal = ({
  visible,
  onHide,
  onSuccess
}) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: {
      errors
    },
    reset
  } = useForm({
    defaultValues: {
      quantity: 1
    }
  });
  const {
    createTransfer,
    loading: submitting
  } = useCreateTransfer();

  // Watchers for dependencies
  const sourceDepositId = watch('source_deposit_id');
  const productId = watch('product_id');

  // Hooks
  const {
    deposits
  } = useDeposits();
  // Wrap deps in hook logic
  const {
    products,
    loading: loadingProducts
  } = useTransferProducts(sourceDepositId || null);
  const {
    lots: sourceLots,
    loading: loadingSourceLots
  } = useTransferLots(productId || null, sourceDepositId || null);

  // Derived helpers
  const selectedProduct = products.find(p => p.id === productId);
  const hasLots = selectedProduct?.has_lots;

  // Reset dependant fields when parent changes
  useEffect(() => {
    if (sourceDepositId) {
      setValue('product_id', null);
      setValue('lot_id', null);
      setValue('source_lot_id', null);
    }
  }, [sourceDepositId, setValue]);
  useEffect(() => {
    if (productId) {
      setValue('lot_id', null);
      setValue('source_lot_id', null);
    }
  }, [productId, setValue]);
  const onSubmit = data => {
    // Validation refinement if needed
    if (data.source_lot_id) {
      data.lot_id = data.source_lot_id;
    }
    createTransfer(data).then(res => {
      if (res.success) {
        reset();
        onSuccess();
        onHide();
      } else {
        alert("Error: " + res.message);
      }
    });
  };
  const dialogFooter = /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    className: "p-button-text p-button-secondary",
    onClick: onHide
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-times me-2"
  })), /*#__PURE__*/React.createElement(Button, {
    label: "Transferir",
    className: "p-button-primary",
    onClick: handleSubmit(onSubmit),
    loading: submitting
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-check me-2"
  })));
  const depositOptions = deposits.map(d => ({
    label: d.attributes.name,
    value: d.id
  }));
  const productOptions = products.map(p => ({
    label: `${p.name} (Stock: ${p.stock})`,
    value: p.id
  }));
  const lotOptions = sourceLots.map(l => ({
    label: `${l.lot_number} (Exp: ${l.expiration_date}, Stock: ${l.stock})`,
    value: l.id
  }));
  return /*#__PURE__*/React.createElement(Dialog, {
    header: "Traslado de Inventario",
    visible: visible,
    style: {
      width: '50vw'
    },
    footer: dialogFooter,
    onHide: onHide
  }, /*#__PURE__*/React.createElement("form", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "source_deposit",
    className: "form-label"
  }, "Dep\xF3sito Origen"), /*#__PURE__*/React.createElement(Controller, {
    name: "source_deposit_id",
    control: control,
    rules: {
      required: 'Depósito Origen es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: "source_deposit"
    }, field, {
      options: depositOptions,
      placeholder: "Seleccione Origen",
      filter: true,
      className: `w-100 ${errors.source_deposit_id ? 'p-invalid' : ''}`
    }))
  }), errors.source_deposit_id && /*#__PURE__*/React.createElement("small", {
    className: "text-danger"
  }, errors.source_deposit_id.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dest_deposit",
    className: "form-label"
  }, "Dep\xF3sito Destino"), /*#__PURE__*/React.createElement(Controller, {
    name: "destination_deposit_id",
    control: control,
    rules: {
      required: 'Depósito Destino es requerido',
      validate: value => value !== sourceDepositId || "El destino no puede ser igual al origen"
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: "dest_deposit"
    }, field, {
      options: depositOptions,
      placeholder: "Seleccione Destino",
      filter: true,
      className: `w-100 ${errors.destination_deposit_id ? 'p-invalid' : ''}`
    }))
  }), errors.destination_deposit_id && /*#__PURE__*/React.createElement("small", {
    className: "text-danger"
  }, errors.destination_deposit_id.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "product",
    className: "form-label"
  }, "Producto"), /*#__PURE__*/React.createElement(Controller, {
    name: "product_id",
    control: control,
    rules: {
      required: 'Producto es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: "product"
    }, field, {
      options: productOptions,
      placeholder: "Seleccione Producto",
      filter: true,
      disabled: !sourceDepositId,
      loading: loadingProducts,
      className: `w-100 ${errors.product_id ? 'p-invalid' : ''}`
    }))
  }), errors.product_id && /*#__PURE__*/React.createElement("small", {
    className: "text-danger"
  }, errors.product_id.message)), hasLots && /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "source_lot",
    className: "form-label"
  }, "Lote Origen"), /*#__PURE__*/React.createElement(Controller, {
    name: "source_lot_id",
    control: control,
    rules: {
      required: 'Lote de origen es requerido'
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(Dropdown, _extends({
      id: "source_lot"
    }, field, {
      options: lotOptions,
      placeholder: "Seleccione Lote",
      loading: loadingSourceLots,
      className: `w-100 ${errors.source_lot_id ? 'p-invalid' : ''}`
    }))
  }), errors.source_lot_id && /*#__PURE__*/React.createElement("small", {
    className: "text-danger"
  }, errors.source_lot_id.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "quantity",
    className: "form-label"
  }, "Cantidad"), /*#__PURE__*/React.createElement(Controller, {
    name: "quantity",
    control: control,
    rules: {
      required: 'Cantidad es requerida',
      min: 1
    },
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      id: "quantity",
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      showButtons: true,
      min: 1,
      className: `w-100 ${errors.quantity ? 'p-invalid' : ''}`
    })
  }), errors.quantity && /*#__PURE__*/React.createElement("small", {
    className: "text-danger"
  }, errors.quantity.message)), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "notes",
    className: "form-label"
  }, "Notas"), /*#__PURE__*/React.createElement(Controller, {
    name: "notes",
    control: control,
    render: ({
      field
    }) => /*#__PURE__*/React.createElement(InputTextarea, _extends({
      id: "notes"
    }, field, {
      rows: 3,
      autoResize: true,
      className: "w-100"
    }))
  }))));
};