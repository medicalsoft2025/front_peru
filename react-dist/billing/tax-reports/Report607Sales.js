import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { invoiceService } from "../../../services/api/index.js";
import { Toast } from "primereact/toast";
import { PrimeReactProvider } from "primereact/api";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { Tag } from "primereact/tag";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { useThirdParties } from "../../billing/third-parties/hooks/useThirdParties.js";
import { use607SalesFormatFormat } from "../../documents-generation/hooks/billing/tax-report/use607SalesFormat.js";
import { exportToExcel } from "../../accounting/utils/ExportToExcelOptions.js";
import { formatDate } from "../../../services/utilidades.js";
import { statusInvoices } from "../../../services/commons.js";
export const Report607Sales = () => {
  const toast = useRef(null);
  const {
    thirdParties
  } = useThirdParties();
  const [filtros, setFiltros] = useState({
    numeroFactura: "",
    cliente: null,
    fechaRango: null,
    estado: null
  });
  const {
    generateFormat607SalesFormat
  } = use607SalesFormatFormat();
  const {
    data: reportData,
    loading: loadingPaginator,
    first,
    perPage,
    totalRecords,
    handlePageChange,
    handleSearchChange,
    refresh
  } = useDataPagination({
    fetchFunction: params => loadFormat606Sales(params),
    defaultPerPage: 10
  });
  async function loadFormat606Sales(params = {
    perPage: 10
  }) {
    const backendFilters = {
      ...params,
      type: "sale",
      sort: "-id"
    };
    if (filtros.numeroFactura && filtros.numeroFactura.trim() !== "") {
      backendFilters.document_number = filtros.numeroFactura.trim();
    }
    if (filtros.cliente) {
      backendFilters.third_party_id = filtros.cliente;
    }
    if (filtros.fechaRango && Array.isArray(filtros.fechaRango)) {
      const fechaArray = filtros.fechaRango;
      if (fechaArray.length >= 2) {
        const startDate = fechaArray[0];
        const endDate = fechaArray[1];
        if (startDate && typeof startDate.toISOString === "function") {
          backendFilters.start_date = startDate.toISOString().split("T")[0];
        }
        if (endDate && typeof endDate.toISOString === "function") {
          backendFilters.end_date = endDate.toISOString().split("T")[0];
        }
      }
    }
    if (filtros.estado) {
      backendFilters.status = filtros.estado;
    }
    if (params.search && params.search.trim() !== "") {
      backendFilters.search = params.search.trim();
    }
    const data = await invoiceService.taxReportFormats(backendFilters);
    return {
      data: data.data.data,
      total: data.data.total || 0
    };
  }
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const limpiarFiltros = () => {
    setFiltros({
      numeroFactura: "",
      cliente: null,
      fechaRango: null,
      estado: null
    });
  };
  useEffect(() => {
    if (filtros.numeroFactura === "" && filtros.cliente === null && filtros.fechaRango === null && filtros.estado === null) {
      // Si todos los filtros están limpios, refrescar para obtener datos sin filtros
      refresh();
    }
  }, [filtros]);
  const estadosFactura = [{
    label: "Pagada",
    value: "paid"
  }, {
    label: "Pendiente",
    value: "pending"
  }, {
    label: "Parcialmente Pagada",
    value: "partially_pending"
  }, {
    label: "Anulada",
    value: "cancelled"
  }, {
    label: "Vencida",
    value: "expired"
  }];
  function getIncomeType(incomeType) {
    const incomeTypes = {
      "medications": "Medicamentos",
      "vaccines": "Vacunas",
      "inventariables": "Inventariables",
      "supplies": "Insumos",
      "itbis_billed": "ITBIS facturado",
      "isr_received": "ISR Percibido",
      "consumption_tax": "Impuesto Selectivo al Consumo",
      "operational_income_non_financial": "Ingresos por operaciones (No financieros)",
      "financial_income": "Ingresos Financieros",
      "extraordinary_income": "Ingresos Extraordinarios",
      "rental_income": "Ingresos por Arrendamientos",
      "depreciable_asset_sale_income": "Ingresos por Venta de Activo Depreciable",
      "other_income": "Otros Ingresos",
      "personal_expenses": "Gastos de personal",
      "work_supplies_services": "Gastos por trabajos, suministros y servicios",
      "rentals": "Arrendamientos",
      "fixed_assets_expenses": "Gastos de activos fijos",
      "representation_expenses": "Gastos de representación",
      "other_allowed_deductions": "Otras deducciones admitidas",
      "financial_expenses": "Gastos financieros",
      "extraordinary_expenses": "Gastos extraordinarios",
      "purchase_sale_cost": "Compras y gastos que formarán parte del costo de venta",
      "asset_acquisitions": "Adquisiciones de activos",
      "insurance_expenses": "Gastos de seguros",
      "": "--"
    };
    return incomeTypes[incomeType] || "";
  }
  const getEstadoSeverity = estado => {
    switch (estado) {
      case "paid":
        return "success";
      case "pending":
      case "partially_pending":
        return "warning";
      case "cancelled":
        return "danger";
      case "expired":
        return "danger";
      default:
        return null;
    }
  };
  const getEstadoLabel = estado => {
    switch (estado) {
      case "paid":
        return "Pagada";
      case "pending":
        return "Pendiente";
      case "partially_pending":
        return "Parcialmente Pagada";
      case "cancelled":
        return "Anulada";
      case "expired":
        return "Vencida";
      default:
        return "";
    }
  };
  const columns = [{
    field: "id",
    header: "Id",
    sortable: true
  }, {
    field: "third_party.document_number",
    header: "RNC/Cedula o Pasaporte",
    sortable: true,
    body: rowData => {
      return rowData.third_party?.document_number || "";
    }
  }, {
    field: "document_number",
    header: "Tipo de identificacion",
    sortable: true,
    body: rowData => {
      switch (rowData.third_party?.document_type) {
        case "RNC":
          return 1;
        case "CC":
          return 2;
        default:
          return 3;
      }
    }
  }, {
    field: "invoice_code",
    header: "No. Comprobante fiscal",
    sortable: true,
    body: rowData => {
      return rowData.invoice_code || "";
    }
  }, {
    field: "income_type",
    header: "Tipo de ingreso",
    sortable: true,
    body: rowData => `${getIncomeType(rowData?.income_type?.accounting_account?.category || "")}`
  }, {
    field: "created_at",
    header: "Fecha de comprobante",
    sortable: true,
    body: rowData => `${new Date(rowData.created_at).toLocaleDateString()}`.slice(0, 10)
  }, {
    field: "retention_date",
    header: "Fecha de retencion",
    sortable: true
  }, {
    field: "amount",
    header: "Monto facturado",
    sortable: true,
    body: rowData => `$${Number(rowData.total_amount).toFixed(2)}`
  }, {
    field: "itbis_factured",
    header: "ITBIS facturado",
    sortable: true,
    body: rowData => `$${rowData.itbis_factured.toFixed(2)}`
  }, {
    field: "tax_isr_received",
    header: "ISR percibido",
    sortable: true,
    body: rowData => `$${rowData.tax_isr_received.toFixed(2)}`
  }, {
    field: "consumption_tax",
    header: "Impuesto selectivo al consumo",
    sortable: true,
    body: rowData => `$${rowData.consumption_tax.toFixed(2)}`
  }, {
    field: "iva",
    header: "Otro impuestos",
    sortable: true,
    body: rowData => `$${Number(rowData.iva).toFixed(2)}`
  }, {
    field: "payment_cash",
    header: "Efectivo",
    sortable: true,
    body: rowData => `$${rowData.payment_cash.toFixed(2)}`
  }, {
    field: "payment_transfer",
    header: "Cheque/transferencia/deposito",
    sortable: true,
    body: rowData => `$${rowData.payment_transfer.toFixed(2)}`
  }, {
    field: "payment_card",
    header: "Tarjeta débito/crédito",
    sortable: true,
    body: rowData => `$${rowData.payment_card.toFixed(2)}`
  }, {
    field: "payment_credit",
    header: "Venta a crédito",
    sortable: true,
    body: rowData => `$${rowData.payment_credit.toFixed(2)}`
  }, {
    field: "payment_gift_certificate",
    header: "Bonos o certificado de regalo",
    sortable: true,
    body: rowData => `$${rowData.payment_gift_certificate.toFixed(2)}`
  }, {
    field: "payment_swap",
    header: "Permuta",
    sortable: true,
    body: rowData => `$${rowData.payment_swap.toFixed(2)}`
  }, {
    field: "payment_default",
    header: "Otras formas de pago",
    sortable: true,
    body: rowData => `$${rowData.payment_default.toFixed(2)}`
  }, {
    field: "status",
    header: "Estado",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: getEstadoLabel(rowData.status),
      severity: getEstadoSeverity(rowData.status)
    })
  }];
  function exportToPDF() {
    return generateFormat607SalesFormat(reportData, "Impresion");
  }
  const exportExcel = () => {
    const dataExport = handleDataExport(reportData);
    exportToExcel({
      data: dataExport,
      fileName: `607_Ventas`
    });
  };
  function handleDataExport(dataToExport) {
    const data = dataToExport.map((item, index) => {
      return {
        id: item?.invoice?.id || index + 1,
        numero_documento: item?.third_party?.document_number || "",
        tipo_documento: getDocumentType(item?.third_party?.document_type || ""),
        invoice_code: item?.invoice_code || "",
        tipo_ingreso: getIncomeType(item?.income_type?.accounting_account?.category || ""),
        fecha: formatDate(item.created_at, true),
        fecha_retencion: item?.retention_date || "",
        monto_total: `$${(Number(item?.total_amount) || 0).toFixed(2)}`,
        itbis_facturado: `$${(Number(item?.itbis_factured) || 0).toFixed(2)}`,
        isr_retenido: `$${(Number(item?.tax_isr_received) || 0).toFixed(2)}`,
        impuesto_consumo: `$${(Number(item?.consumption_tax) || 0).toFixed(2)}`,
        iva: `$${(Number(item?.iva) || 0).toFixed(2)}`,
        pago_efectivo: `$${(Number(item?.payment_cash) || 0).toFixed(2)}`,
        pago_transferencia: `$${(Number(item?.payment_transfer) || 0).toFixed(2)}`,
        pago_tarjeta: `$${(Number(item?.payment_card) || 0).toFixed(2)}`,
        pago_credito: `$${(Number(item?.payment_credit) || 0).toFixed(2)}`,
        pago_certificado: `$${(Number(item?.payment_gift_certificate) || 0).toFixed(2)}`,
        pago_canje: `$${(Number(item?.payment_swap) || 0).toFixed(2)}`,
        pago_por_defecto: `$${(Number(item?.payment_default) || 0).toFixed(2)}`,
        estado: statusInvoices[item?.status]?.slice(0, 10) || "",
        tercero: `${item?.third_party?.name ?? ""}`.trim()
      };
    });
    return data;
  }
  function getDocumentType(documentType) {
    const documentTypes = {
      "RNC": "01",
      "CC": "02"
    };
    return documentTypes[documentType] || "03";
  }
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between"
  }, /*#__PURE__*/React.createElement("h4", null, "606 - Compras"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a Excel",
    tooltipOptions: {
      position: "top"
    },
    onClick: () => exportExcel(),
    className: "p-button-success",
    disabled: reportData.length === 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-excel"
  }, " ")), /*#__PURE__*/React.createElement(Button, {
    tooltip: "Exportar a PDF",
    tooltipOptions: {
      position: "top"
    },
    onClick: () => exportToPDF(),
    className: "p-button-secondary",
    disabled: reportData.length === 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "fa-solid fa-file-pdf"
  }, " ")))), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
    header: "Filtros de B\xFAsqueda"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "N\xFAmero de factura"), /*#__PURE__*/React.createElement(InputText, {
    value: filtros.numeroFactura,
    onChange: e => handleFilterChange("numeroFactura", e.target.value),
    placeholder: "B01-001-0000001",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Cliente"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.cliente,
    onChange: e => handleFilterChange("cliente", e.target.value),
    options: thirdParties,
    optionLabel: "name",
    optionValue: "id",
    placeholder: "Seleccione un proveedor",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: filtros.fechaRango,
    onChange: e => handleFilterChange("fechaRango", e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione un rango",
    className: "w-100",
    showIcon: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 col-md-6 mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Estado"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filtros.estado,
    options: estadosFactura,
    onChange: e => handleFilterChange("estado", e.value),
    optionLabel: "label",
    placeholder: "Seleccione estado",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "p-button-secondary",
    onClick: limpiarFiltros
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary",
    onClick: () => refresh(),
    loading: loadingPaginator
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: reportData,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: loadingPaginator,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: () => refresh()
  })), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};