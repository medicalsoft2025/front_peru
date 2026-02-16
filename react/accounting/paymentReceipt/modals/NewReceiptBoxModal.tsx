import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

import {
  FormData,
  MetodoPago,
  DropdownOption,
  NewReceiptBoxModalProps,
} from "../../interface/interfaceCashRecipe";
import { useCreateCashRecipeWithInvoice } from "../../hooks/useCashReceipts";
import { usePaymentMethods } from "../../../payment-methods/hooks/usePaymentMethods";
import { useThirdParties } from "../../../billing/third-parties/hooks/useThirdParties";
import { ThirdParty } from "../../interface/interfaceCashRecipe";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { useCentresCosts } from "../../../centres-cost/hooks/useCentresCosts";
import { Card } from "primereact/card";
import { formatDate } from "../../../../services/utilidades";

const mapFormDataToPayload = (formData: FormData) => {
  const getUserIdFromLocalStorage = () => {
    try {
      const userDataString = localStorage.getItem("userData");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        const userId = userData.id;
        return userId;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error al obtener userId:", error);
      return null;
    }
  };

  const userId = getUserIdFromLocalStorage();
  let purchase_order_id = null;
  const invoices =
    formData.type !== "purchase-order" && formData.type !== "sale-order"
      ? [
          {
            invoice_id: Number(formData.id) || Number(formData.idFactura),
            applied_amount: formData.valorPagado,
          },
        ]
      : [];

  if (formData.type === "purchase-order" || formData.type === "sale-order") {
    purchase_order_id = Number(formData.id) || Number(formData.idFactura);
  }

  return {
    type: formData.tipo.toLowerCase(),
    action: formData.realizarUn,
    subtotal: formData.valorPagado,
    discount: formData.discount,
    iva: formData.iva,
    total_amount: formData.valorPagado,
    observations: formData.observaciones,
    due_date: formData.fechaElaboracion?.toISOString().split("T")[0],
    paid_amount: formData.valorPagado,
    remaining_amount: 0,
    quantity_total: formData.quantity_total,
    third_party_id: parseInt(formData.clientes),
    user_id: userId,
    advance_role: formData.type === "purchase-order" ? "provider" : "customer",
    details: [
      {
        product_id: 1,
        quantity: 1,
        unit_price: formData.valorPagado,
        amount: formData.valorPagado,
        discount: 0,
        subtotal: formData.valorPagado,
      },
    ],
    payments: [
      {
        payment_method_id: parseInt(formData.metodoPagoId),
        payment_date: formData.fechaElaboracion?.toISOString().split("T")[0],
        amount: Number(formData.valorPagado),
        credit_card_or_bank: formData.origenDinero,
        credit_card_or_check_number: "",
        account_number: "",
        notes: "",
      },
    ],
    invoices: invoices,
    purchase_order_id: purchase_order_id,
  };
};

export const NewReceiptBoxModal: React.FC<NewReceiptBoxModalProps> = ({
  visible,
  onHide,
  onSubmit,
  onSave,
  onSaveAndDownload,
  initialData,
}) => {
  const { createCashRecipeWithInvoice, isLoading, error, success } =
    useCreateCashRecipeWithInvoice();
  const { paymentMethods, loading: loadingPaymentMethods } =
    usePaymentMethods();
  const { thirdParties, loading: loadingThirdParties } = useThirdParties();
  const { centresCosts, loading: loadingCostCenters } = useCentresCosts();
  const [isBlockedInputs, setIsBlockedInputs] = useState(false);
  const [isShowInputs, setIsShowInputs] = useState(false);
  const [cashReceiptType, setCashReceiptType] = useState("");
  const [realizarUnOptions, setRealizarUnOptions] = useState<DropdownOption[]>(
    [],
  );
  const [amounttotalInvoice, setAmounttotalInvoice] = useState<any>(0);

  const { control, handleSubmit, setValue, reset, watch } = useForm<FormData>({
    defaultValues: {
      idFactura: 0,
      cliente: "",
      tipo: "",
      clientes: "",
      realizarUn: "",
      metodoPagoId: "",
      origenDinero: "",
      numeroRecibo: "",
      numeroFactura: initialData?.idFactura || "",
      fechaElaboracion: null,
      centroCosto: initialData?.centreCost?.id?.toString() || "",
      valorPagado: 0,
      observaciones: "",
      archivo: null,
      type: "",
      subtotal: 0,
      discount: 0,
      iva: 0,
      total_amount: 0,
      due_date: new Date(),
      quantity_total: 0,
      third_party_id: 0,
      user_id: 0,
    },
  });

  const realizarUnValue = watch("realizarUn");
  const tipoValue = watch("tipo");
  const typeValue = watch("type");

  // Reset del formulario cuando se abre el modal o cambian los initialData
  useEffect(() => {
    if (visible) {
      // Resetear el formulario con los nuevos valores
      reset({
        idFactura: initialData?.idFactura || 0,
        numeroFactura:
          (initialData?.invoiceType == "purchase-order" ? "OC " : "CT ") +
            initialData?.idFactura || "",
        fechaElaboracion: initialData?.fechaElaboracion || null,
        centroCosto: initialData?.centreCost?.id?.toString() || "",
        clientes: handleThirdParty(initialData?.invoiceType) || "",
        tipo: selectTypeInvoice(initialData?.invoiceType || ""),
        type: initialData?.invoiceType || "",
        discount: initialData?.discount || 0,
        iva: initialData?.iva || 0,
        total_amount: initialData?.total_amount || 0,
        due_date: new Date(initialData?.due_date || new Date()),
        quantity_total: initialData?.quantity_total || 0,
        third_party_id: handleThirdParty(initialData?.invoiceType) || 0,
        user_id: Number(initialData?.user_id) || 0,
        numeroRecibo: generarNumeroRecibo(),
      });

      setAmounttotalInvoice(initialData?.valorPagado || 0);

      if (
        initialData?.invoiceType === "purchase-order" ||
        initialData?.invoiceType === "sale-order"
      ) {
        setIsBlockedInputs(true);
        setIsShowInputs(true);
      } else {
        setIsBlockedInputs(false);
        setIsShowInputs(false);
      }

      generateOptionsToMakeInvoice(initialData?.invoiceType);

      switch (initialData?.invoiceType) {
        case "purchase-order":
        case "purchase-invoice":
          setCashReceiptType("provider");
          break;
        case "sale-order":
        case "sale-invoice":
          setCashReceiptType("client");
          break;
        case "entity":
          setCashReceiptType("entity");
          break;
      }
    }
  }, [visible, initialData, reset]);

  // Efecto para auto-completar el valor pagado cuando se selecciona pago completo
  useEffect(() => {
    if (realizarUnValue === "full_payment" && amounttotalInvoice) {
      setValue("valorPagado", amounttotalInvoice);
    }
  }, [realizarUnValue, amounttotalInvoice, setValue]);

  // Generar número de recibo
  const generarNumeroRecibo = () => {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const numero = Math.floor(1000 + Math.random() * 9000);
    return `RC-${año}-${numero}`;
  };

  function selectTypeInvoice(type: string) {
    switch (type) {
      case "purchase-order":
      case "purchase-invoice":
        return "Egreso";
      case "sale-invoice":
      case "sale-order":
        return "Ingreso";
      case "entity":
        return "Ingreso";
      default:
        return "";
    }
  }

  function handleThirdParty(invoiceType: string) {
    switch (invoiceType) {
      case "purchase-order":
      case "purchase-invoice":
        return initialData?.cliente?.toString() || "0";
      case "sale-order":
      case "sale-invoice":
        return initialData?.cliente?.toString() || "0";
      case "entity":
        const thirdParty: any = thirdParties.filter(
          (thirdParty: any) =>
            Number(thirdParty.external_id) == initialData?.third_party_id,
        )[0];
        return (thirdParty?.id || 0).toString();
      default:
        return "0";
    }
  }

  function generateOptionsToMakeInvoice(invoiceType: string) {
    const realizarUnOptions: any[] = [
      { label: "Abono a factura", value: "partial_payment" },
      { label: "Anticipo", value: "advance_payment" },
      { label: "Pago completo", value: "full_payment" },
    ];
    let filteredOptions: any[] = [];

    switch (invoiceType) {
      case "purchase-invoice":
      case "sale-invoice":
      case "entity":
        filteredOptions = realizarUnOptions.filter(
          (option) => option.value !== "advance_payment",
        );
        setRealizarUnOptions(filteredOptions);
        break;
      case "purchase-order":
      case "sale-order":
        filteredOptions = realizarUnOptions.filter(
          (option) => option.value == "advance_payment",
        );
        setRealizarUnOptions(filteredOptions);
        break;
      default:
        setRealizarUnOptions(realizarUnOptions);
        break;
    }
  }

  const tipoOptions: DropdownOption[] = [
    { label: "Ingreso", value: "Ingreso" },
    { label: "Egreso", value: "Egreso" },
  ];

  const clientesOptions: DropdownOption[] = thirdParties.map(
    (cliente: ThirdParty) => ({
      label: cliente.name,
      value: String(cliente.id),
    }),
  );

  const metodoPagoOptions: DropdownOption[] = paymentMethods
    .filter((metodo) => metodo.category === "transactional")
    .map((metodo) => ({
      label: metodo.method,
      value: metodo.id,
    }));

  const centroCostoOptions: DropdownOption[] = centresCosts.map((centro) => ({
    label: centro.name,
    value: centro.id.toString(),
  }));

  const onFileUpload = (e: { files: File[] }) => {
    setValue("archivo", e.files[0]);
  };

  const handleSave = async (data: FormData) => {
    const payload = mapFormDataToPayload(data);
    try {
      await createCashRecipeWithInvoice(payload);
      onHide();
      // Resetear el formulario después de guardar
      reset();
    } catch (err) {
      console.error("Error al guardar el recibo:", err);
    }
  };

  const handleSaveAndDownload = async (data: FormData) => {
    const payload = mapFormDataToPayload(data);
    try {
      await createCashRecipeWithInvoice(payload);
      onHide();
      // Resetear el formulario después de guardar
      reset();
    } catch (err) {
      console.error("Error al guardar el recibo:", err);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Dialog
      header="Recibo de Caja"
      visible={visible}
      style={{ width: "80vw" }}
      onHide={() => {
        onHide();
        reset(); // Resetear el formulario al cerrar
      }}
      maximizable
      modal
      className="p-fluid"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="row mb-4">
          {/* Columna izquierda */}
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="tipo" className="form-label">
                Tipo
              </label>
              <Controller
                name="tipo"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="tipo"
                    value={field.value}
                    options={tipoOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Seleccione..."
                    className="w-100"
                    appendTo={"self"}
                    filter
                    showClear
                    disabled={isBlockedInputs}
                  />
                )}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="clientes" className="form-label">
                {cashReceiptType === "provider" ? "Proveedor" : "Cliente"}
              </label>
              <Controller
                name="clientes"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="clientes"
                    value={field.value}
                    options={clientesOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Seleccione..."
                    className="w-100"
                    filter
                    showClear
                    appendTo={"self"}
                  />
                )}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="realizarUn" className="form-label">
                Realizar un
              </label>
              <Controller
                name="realizarUn"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="realizarUn"
                    value={field.value}
                    options={realizarUnOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Seleccione..."
                    className="w-100"
                    filter
                    showClear
                    appendTo={"self"}
                  />
                )}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="metodoPagoId" className="form-label">
                Método de pago
              </label>
              <Controller
                name="metodoPagoId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="metodoPagoId"
                    value={field.value}
                    options={metodoPagoOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Seleccione..."
                    className="w-100"
                    filter
                    showClear
                    appendTo={"self"}
                  />
                )}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="valorPagado" className="form-label">
                Valor pagado
              </label>
              <Controller
                name="valorPagado"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <InputNumber
                    id="valorPagado"
                    inputRef={ref}
                    value={value}
                    onValueChange={(e) => {
                      const newValue = e.value;
                      onChange(newValue ?? 0);
                      // Forzar actualización adicional para PrimeReact
                      setTimeout(() => onChange(newValue ?? 0), 0);
                    }}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    className="w-100"
                  />
                )}
              />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="numeroRecibo" className="form-label">
                Número de recibo (Automático)
              </label>
              <Controller
                name="numeroRecibo"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="numeroRecibo"
                    value={field.value}
                    className="w-100"
                    disabled
                  />
                )}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="numeroFactura" className="form-label">
                {typeValue === "purchase-order"
                  ? "Número de orden de compra"
                  : "Número de factura"}
              </label>
              <Controller
                name="numeroFactura"
                control={control}
                render={({ field }) => (
                  <InputText
                    id="numeroFactura"
                    value={field.value}
                    onChange={(e) => field.onChange(e.target.value)}
                    className="w-100"
                    disabled
                  />
                )}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="fechaElaboracion" className="form-label">
                Fecha de elaboración
              </label>
              <Controller
                name="fechaElaboracion"
                control={control}
                render={({ field }) => (
                  <Calendar
                    id="fechaElaboracion"
                    value={field.value}
                    onChange={(e: any) => field.onChange(e.value)}
                    dateFormat="dd/mm/yy"
                    className="w-100"
                    showIcon
                    placeholder="Seleccione la fecha"
                    appendTo={"self"}
                  />
                )}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="centroCosto" className="form-label">
                Centro de costo
              </label>
              <Controller
                name="centroCosto"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    id="centroCosto"
                    value={field.value}
                    options={centroCostoOptions}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Seleccione..."
                    className="w-100"
                    filter
                    showClear
                    appendTo={"self"}
                  />
                )}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Agregar archivo</label>
              <FileUpload
                mode="basic"
                name="archivo"
                accept="image/*,.pdf,.doc,.docx"
                maxFileSize={1000000}
                chooseLabel="Seleccionar archivo"
                className="w-100"
                onUpload={onFileUpload}
              />
            </div>
          </div>
        </div>

        {/* Observaciones y archivo */}
        <div className="row mb-4">
          <div className="col-12">
            <label htmlFor="observaciones" className="form-label">
              Observaciones
            </label>
            <Controller
              name="observaciones"
              control={control}
              render={({ field }) => (
                <InputTextarea
                  id="observaciones"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  rows={3}
                  className="w-100"
                  placeholder="Detalles adicionales..."
                />
              )}
            />
          </div>
        </div>

        {/* {isShowInputs && (
          <Card
            className="w-100 h-100 summary-card mb-3"
            title="Información adicional"
          >
            <div className="row">
              <div className="col-12">
                <div className="summary-grid">
                  <div className="summary-row">
                    <span className="summary-label">Monto total:</span>
                    <span className="summary-value">
                      {watch("total_amount")?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Descuento:</span>
                    <span className="summary-value">
                      {watch("discount")?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Impuestos:</span>
                    <span className="summary-value">
                      {watch("iva")?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Cantidad total:</span>
                    <span className="summary-value">
                      {watch("quantity_total")?.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </span>
                  </div>

                  <div className="summary-row">
                    <span className="summary-label">Fecha de vencimiento:</span>
                    <span className="summary-value">
                      {formatDate(
                        watch("due_date")?.toLocaleDateString("es-ES"),
                        true
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )} */}

        {/* Botones de acción */}
        <div className="d-flex justify-content-center gap-3">
          <Button
            label="Guardar"
            style={{ width: "200px", padding: "0.5rem 1rem" }}
            className="btn btn-phoenix-secondary"
            onClick={handleSubmit(handleSave)}
          >
            <i className="fas fa-plus"></i>
          </Button>

          <Button
            label="Guardar y Descargar"
            className="btn btn-primary"
            style={{ width: "300px", padding: "0.5rem 1rem" }}
            onClick={handleSubmit(handleSaveAndDownload)}
          >
            <i className="fas fa-download"></i>
          </Button>
        </div>
      </form>
      <style>
        {`
        .summary-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          margin-top: 20px;
        }

        .summary-card .card-title {
          color: #333;
          font-size: 1.2rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }

        .summary-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .summary-label {
          font-weight: 500;
          color: #555;
        }

        .summary-value {
          font-weight: 600;
          color: #222;
        }
        `}
      </style>
    </Dialog>
  );
};
