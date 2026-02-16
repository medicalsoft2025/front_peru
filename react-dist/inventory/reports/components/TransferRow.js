import React, { useEffect, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { useTransferProducts } from "../hooks/useTransferProducts.js";
import { useTransferLots } from "../hooks/useTransferLots.js";
export const TransferRow = ({
  index,
  control,
  setValue,
  watch,
  remove,
  deposits,
  isOnlyRow,
  getUsedStock
}) => {
  // Hooks per row
  const {
    products,
    loading: loadingProducts,
    getProducts,
    setProducts
  } = useTransferProducts();
  const {
    lots: sourceLots,
    loading: loadingSourceLots,
    getLots: getSourceLots,
    setLots: setSourceLots
  } = useTransferLots();
  const {
    lots: destinationLots,
    loading: loadingDestinationLots,
    getLots: getDestinationLots,
    setLots: setDestinationLots
  } = useTransferLots();

  // Watch values
  const sourceDepositId = watch(`transfers.${index}.source_deposit_id`);
  const destinationDepositId = watch(`transfers.${index}.destination_deposit_id`);
  const productId = watch(`transfers.${index}.product_id`);
  const sourceLotId = watch(`transfers.${index}.source_lot_id`);
  const selectedProduct = useMemo(() => products.find(p => p.id === productId), [products, productId]);
  const selectedSourceLot = useMemo(() => sourceLots.find(l => l.id === sourceLotId), [sourceLots, sourceLotId]);

  // Fetch lists logic (Same as before)
  useEffect(() => {
    if (sourceDepositId) {
      getProducts(sourceDepositId);
    } else {
      setProducts([]);
    }
  }, [sourceDepositId, getProducts, setProducts]);
  useEffect(() => {
    if (productId && selectedProduct?.has_lots && sourceDepositId) {
      getSourceLots(productId, sourceDepositId);
    } else {
      setSourceLots([]);
    }
  }, [productId, selectedProduct, sourceDepositId, getSourceLots, setSourceLots]);
  useEffect(() => {
    if (destinationDepositId && productId && selectedProduct?.has_lots) {
      getDestinationLots(productId, destinationDepositId);
    } else {
      setDestinationLots([]);
    }
  }, [destinationDepositId, productId, selectedProduct, getDestinationLots, setDestinationLots]);
  const depositOptions = deposits.map(d => ({
    label: d.attributes.name,
    value: d.id
  }));
  const productOptions = products.map(p => ({
    label: `${p.name} (Stock: ${p.stock})`,
    value: p.id
  }));
  const sourceLotOptions = sourceLots.map(l => ({
    label: `${l.code} (Vence: ${l.expiration_date}, Stock: ${l.quantity})`,
    value: l.id
  }));
  const destinationLotOptions = destinationLots.map(l => ({
    label: `${l.code} (Vence: ${l.expiration_date}, Stock: ${l.quantity})`,
    value: l.id
  })).filter(option => option.value !== sourceLotId);
  const destinationOptions = depositOptions.filter(d => d.value !== sourceDepositId);

  // Calculate Real-Time Available Stock
  const {
    maxQuantity,
    originalStock,
    usedElsewhere
  } = useMemo(() => {
    let stock = 0;
    if (selectedProduct?.has_lots) {
      stock = selectedSourceLot ? selectedSourceLot.quantity : 0;
    } else {
      stock = selectedProduct ? selectedProduct.stock : 0;
    }
    const used = getUsedStock(productId, sourceLotId, index);
    const available = Math.max(0, stock - used);
    return {
      maxQuantity: available,
      originalStock: stock,
      usedElsewhere: used
    };
  }, [selectedProduct, selectedSourceLot, productId, sourceLotId, index, getUsedStock]);

  // Helper to clear dependent fields
  const handleSourceDepositChange = val => {
    setValue(`transfers.${index}.product_id`, 0);
    setValue(`transfers.${index}.lot_id`, null);
    setValue(`transfers.${index}.source_lot_id`, null);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "card mb-3 shadow-sm border-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-white d-flex justify-content-between align-items-center py-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fw-bold text-primary"
  }, "Item #", index + 1), /*#__PURE__*/React.createElement(Button, {
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-trash"
    }),
    className: "p-button-rounded p-button-danger p-button-text p-button-sm",
    onClick: () => remove(index),
    disabled: isOnlyRow,
    tooltip: "Eliminar \xEDtem"
  })), /*#__PURE__*/React.createElement("div", {
    className: "card-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: selectedProduct?.has_lots ? "col-md-4" : "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Dep\xF3sito Origen"), /*#__PURE__*/React.createElement(Controller, {
    name: `transfers.${index}.source_deposit_id`,
    control: control,
    rules: {
      required: 'Requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      id: field.name,
      value: field.value,
      options: depositOptions,
      onChange: e => {
        field.onChange(e.value);
        handleSourceDepositChange(e.value);
      },
      placeholder: "Seleccione Origen",
      filter: true,
      className: classNames('w-100', {
        'is-invalid': fieldState.invalid
      }),
      style: {
        maxWidth: '100%'
      }
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: selectedProduct?.has_lots ? "col-md-4" : "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Producto"), /*#__PURE__*/React.createElement(Controller, {
    name: `transfers.${index}.product_id`,
    control: control,
    rules: {
      required: 'Requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      value: field.value,
      options: productOptions,
      onChange: e => {
        field.onChange(e.value);
        setValue(`transfers.${index}.lot_id`, null);
        setValue(`transfers.${index}.source_lot_id`, null);
        setValue(`transfers.${index}.destination_lot_id`, null);
      },
      placeholder: "Seleccione Producto",
      filter: true,
      className: classNames('w-100', {
        'is-invalid': fieldState.invalid
      }),
      disabled: !sourceDepositId || loadingProducts,
      style: {
        maxWidth: '100%'
      }
    })
  })), selectedProduct?.has_lots && /*#__PURE__*/React.createElement("div", {
    className: "col-md-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Lote Origen"), /*#__PURE__*/React.createElement(Controller, {
    name: `transfers.${index}.lot_id`,
    control: control,
    rules: {
      required: 'Requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      value: field.value,
      options: sourceLotOptions,
      onChange: e => {
        field.onChange(e.value);
        setValue(`transfers.${index}.source_lot_id`, e.value);
      },
      placeholder: "Seleccione Lote",
      className: classNames('w-100', {
        'is-invalid': fieldState.invalid
      }),
      disabled: loadingSourceLots,
      style: {
        maxWidth: '100%'
      }
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Dep\xF3sito Destino"), /*#__PURE__*/React.createElement(Controller, {
    name: `transfers.${index}.destination_deposit_id`,
    control: control,
    rules: {
      required: 'Requerido'
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(Dropdown, {
      value: field.value,
      options: destinationOptions,
      onChange: e => {
        field.onChange(e.value);
        setValue(`transfers.${index}.destination_lot_id`, null);
      },
      placeholder: "Seleccione Destino",
      filter: true,
      className: classNames('w-100', {
        'is-invalid': fieldState.invalid
      }),
      disabled: !productId,
      style: {
        maxWidth: '100%'
      }
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: selectedProduct?.has_lots ? "col-md-4" : "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Cantidad"), /*#__PURE__*/React.createElement(Controller, {
    name: `transfers.${index}.quantity`,
    control: control,
    rules: {
      required: 'Requerido',
      min: {
        value: 1,
        message: 'Min 1'
      },
      max: {
        value: maxQuantity,
        message: `Max disponible: ${maxQuantity}`
      },
      validate: val => val <= maxQuantity || `Excede stock disponible (${maxQuantity})`
    },
    render: ({
      field,
      fieldState
    }) => /*#__PURE__*/React.createElement(InputNumber, {
      value: field.value,
      onValueChange: e => field.onChange(e.value),
      min: 1,
      max: maxQuantity,
      className: classNames('w-100', {
        'is-invalid': fieldState.invalid
      }),
      disabled: !productId || selectedProduct?.has_lots && !sourceLotId,
      showButtons: true
    })
  }), sourceLotId || !selectedProduct?.has_lots ?
  // Only show if we have context to validate
  control._formState.errors.transfers?.[index]?.quantity && /*#__PURE__*/React.createElement("small", {
    className: "text-danger d-block"
  }, control._formState.errors.transfers?.[index]?.quantity?.message) : null)), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end mt-2"
  }, /*#__PURE__*/React.createElement("small", {
    className: classNames("text-muted", {
      "text-danger fw-bold": maxQuantity === 0
    })
  }, selectedProduct ? /*#__PURE__*/React.createElement(React.Fragment, null, "Disponibilidad: ", /*#__PURE__*/React.createElement("strong", null, maxQuantity), usedElsewhere > 0 && /*#__PURE__*/React.createElement("span", {
    className: "text-warning ms-1"
  }, "(-", usedElsewhere, " en uso)"), /*#__PURE__*/React.createElement("span", {
    className: "ms-1"
  }, "(Total: ", originalStock, ")")) : /*#__PURE__*/React.createElement("span", null, "\xA0")))));
};