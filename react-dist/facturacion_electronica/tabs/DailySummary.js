import React, { useRef } from "react";
import { Card } from "primereact/card";
import { boletasService } from "../../../services/api/index.js";
import { Toast } from "primereact/toast";
import { PrimeReactProvider } from "primereact/api";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useDataPagination } from "../../hooks/useDataPagination.js";
import { use606PurchasesFormatFormat } from "../../documents-generation/hooks/billing/tax-report/use606PurchasesFormat.js";
import { exportToExcel } from "../../accounting/utils/ExportToExcelOptions.js";
import { formatDate } from "../../../services/utilidades.js";
import { CustomPRTableMenu } from "../../components/CustomPRTableMenu.js";
export const DailySummary = () => {
  const toast = useRef(null);
  const {
    generateFormat606PurchasesFormat
  } = use606PurchasesFormatFormat();
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
    fetchFunction: params => loadDailySummaryReport(params),
    defaultPerPage: 10
  });
  async function loadDailySummaryReport(params = {
    perPage: 10
  }) {
    const backendFilters = {
      ...params
    };
    if (backendFilters.search === "") {
      delete backendFilters.search;
    }
    const data = await boletasService.getDailySummary(backendFilters);
    return {
      data: data.data,
      total: data.pagination.total || 0
    };
  }
  function exportToPDF() {
    return generateFormat606PurchasesFormat(reportData, "Impresion");
  }
  const exportExcel = () => {
    const dataExport = handleDataExport(reportData);
    exportToExcel({
      data: dataExport,
      fileName: `resumen_diario`
    });
  };
  function handleDataExport(dataToExport) {
    const data = dataToExport.map((item, index) => {
      return {
        id: item?.invoice?.id || index + 1,
        numero_documento: item?.third_party?.document_number || "",
        invoice_code: item?.invoice_code || "",
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
        tercero: `${item?.third_party?.name ?? ""}`.trim()
      };
    });
    return data;
  }
  async function sendToSunat(rowData) {
    try {
      const response = await boletasService.sendToSunat(rowData.id);
      toast.current?.show({
        severity: "success",
        summary: "Resumen enviado a Sunat",
        detail: response.message,
        life: 3000
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000
      });
    } finally {
      refresh();
    }
  }
  const getMenuItems = rowData => [{
    label: "Enviar a Sunat",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-paper-plane me-2"
    }),
    command: () => sendToSunat(rowData)
  }];
  const accionesBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(CustomPRTableMenu, {
      rowData: rowData,
      menuItems: getMenuItems(rowData)
    }));
  };
  const columns = [{
    field: "id",
    header: "Id",
    sortable: true
  }, {
    field: "Invoice_code",
    header: "Factura",
    sortable: true,
    body: rowData => {
      return rowData.numero_completo || "";
    }
  }, {
    field: "status_sunat",
    header: "Estado Sunat",
    sortable: true,
    body: rowData => {
      return rowData.estado_sunat.charAt(0).toUpperCase() + rowData.estado_sunat.slice(1).toLowerCase() || "";
    }
  }, {
    field: "status_process",
    header: "Estado proceso",
    sortable: true,
    body: rowData => {
      return rowData.estado_proceso.charAt(0).toUpperCase() + rowData.estado_proceso.slice(1).toLowerCase() || "";
    }
  }, {
    field: "fecha_resumen",
    header: "Fecha de resumen",
    sortable: true,
    body: rowData => `${new Date(rowData.fecha_resumen).toLocaleDateString()}`.slice(0, 10)
  }, {
    field: "fecha_generacion",
    header: "Fecha de generacion",
    sortable: true,
    body: rowData => `${new Date(rowData.fecha_generacion).toLocaleDateString()}`.slice(0, 10)
  }, {
    field: "actions",
    header: "Acciones",
    body: accionesBodyTemplate,
    exportable: false,
    style: {
      minWidth: "80px",
      textAlign: "center"
    },
    width: "80px"
  }];
  return /*#__PURE__*/React.createElement(PrimeReactProvider, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-start"
  }, /*#__PURE__*/React.createElement("h4", null, "Resumen diario")), /*#__PURE__*/React.createElement(CustomPRTable, {
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