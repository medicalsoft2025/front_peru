import React, { useState, useEffect } from "react";
import { useCashControlReport } from "./hooks/useCashControlReport.js";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { useUsersForSelect } from "../users/hooks/useUsersForSelect.js";
import { exportCierresCajaToExcel } from "./excel/exportCashControlToExcel.js";
import { generatePDFFromHTMLV2 } from "../../funciones/funcionesJS/exportPDFV2.js";
import { useCompany } from "../hooks/useCompany.js";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
export const CierreCaja = () => {
  const {
    cashControlReportItems,
    fetchCashControlReport,
    loading
  } = useCashControlReport();
  const {
    users
  } = useUsersForSelect();
  const {
    company
  } = useCompany();
  const [selectedWhoDeliversIds, setSelectedWhoDeliversIds] = useState([]);
  const [selectedWhoValidateIds, setSelectedWhoValidateIds] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [expandedRows, setExpandedRows] = useState([]);

  // Formatear dinero en formato local
  const formatoDinero = cantidad => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(cantidad);
  };
  const dineroBodyTemplate = (rowData, field) => {
    return formatoDinero(rowData[field]);
  };
  const differenceBodyTemplate = rowData => {
    const amount = rowData.remaining_amount;
    const colorClass = amount >= 0 ? "text-success" : "text-danger";
    return /*#__PURE__*/React.createElement("span", {
      className: `fw-bold ${colorClass}`
    }, formatoDinero(amount));
  };

  // Obtener fecha formateada
  const obtenerFechaFormateada = fechaStr => {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  const dateBodyTemplate = rowData => {
    return obtenerFechaFormateada(rowData.created_at);
  };
  const handleExportExcel = () => {
    exportCierresCajaToExcel({
      cierres: cashControlReportItems,
      fileName: "Mis_Cierres",
      sheetName: "Reporte Diario"
    });
  };
  const handleExportPDF = async () => {
    if (!cashControlReportItems || cashControlReportItems.length === 0) return;

    // Generar la tabla HTML para el PDF
    const tableHTML = generateCierresTableHTML(cashControlReportItems);
    const configPDF = {
      name: "Cierre_de_Caja"
    };
    await generatePDFFromHTMLV2(tableHTML, company, configPDF);
  };
  const generateCierresTableHTML = cierres => {
    // 1. Identificar todos los métodos de pago únicos dinámicamente
    const uniqueMethods = new Set();
    cierres.forEach(cierre => {
      cierre.details?.forEach(detalle => {
        // Usar el nombre del método desde payment_method.method si existe, o el fallback
        const methodName = detalle.payment_method?.method || detalle.payment_method_name || "Desconocido";
        if (methodName) {
          uniqueMethods.add(methodName);
        }
      });
    });
    const metodosPagoArray = Array.from(uniqueMethods).sort();

    // 2. Agrupar datos por cajera y método de pago
    const datosPorCajera = {};
    let totalGeneral = 0;
    cierres.forEach(cierre => {
      if (!cierre.who_delivers_name) return;
      if (!datosPorCajera[cierre.who_delivers_name]) {
        datosPorCajera[cierre.who_delivers_name] = {};
      }
      cierre.details?.forEach(detalle => {
        const metodo = detalle.payment_method?.method || detalle.payment_method_name || "Desconocido";
        if (!metodo) return;
        datosPorCajera[cierre.who_delivers_name][metodo] = (datosPorCajera[cierre.who_delivers_name][metodo] || 0) + (parseFloat(detalle.total_received) || 0);
        totalGeneral += parseFloat(detalle.total_received) || 0;
      });
    });

    // 4. Calcular totales por método de pago
    const totalesPorMetodo = {};
    metodosPagoArray.forEach(metodo => {
      totalesPorMetodo[metodo] = Object.values(datosPorCajera).reduce((sum, cajera) => sum + (cajera[metodo] || 0), 0);
    });

    // Cálculo específico para BHD y Efectivo si existen en los métodos dinámicos
    // Esto es opcional, si quieres mantener el resumen específico de BHD
    const totalBHD = cierres.reduce((sum, cierre) => {
      return sum + (cierre.details?.reduce((detailSum, detalle) => {
        const name = detalle.payment_method?.method || detalle.payment_method_name || "";
        if (name.toUpperCase().includes("BHD")) {
          return detailSum + (parseFloat(detalle.total_received) || 0);
        }
        return detailSum;
      }, 0) || 0);
    }, 0);
    return `
      <style>
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: #333;
        margin: 0;
        padding: 15px;
      }
      .header {
        text-align: center;
        margin-bottom: 20px;
        border-bottom: 2px solid #424a51;
        padding-bottom: 10px;
      }
      .company-name {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 5px;
      }
      .report-title {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 5px;
        color: #424a51;
      }
      .report-date {
        font-size: 12px;
        color: #666;
      }
      .section {
        margin-bottom: 25px;
      }
      .section-title {
        background-color: #424a51;
        color: white;
        padding: 8px 12px;
        font-weight: bold;
        margin-bottom: 15px;
        border-radius: 4px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      th {
        background-color: #424a51;
        color: white;
        padding: 10px;
        text-align: left;
        font-weight: normal;
      }
      td {
        padding: 10px;
        border: 1px solid #ddd;
      }
      .text-right {
        text-align: right;
      }
      .text-center {
        text-align: center;
      }
      .text-bold {
        font-weight: bold;
      }
      .total-row {
        background-color: #f8f9fa;
      }
      .grand-total {
        background-color: #e9ecef;
        font-weight: bold;
      }
      .summary-table {
        width: 50%;
        margin: 20px auto;
      }
      .summary-table td {
        padding: 12px;
      }
    </style>
         <div class="header">
      <div class="company-name">${company?.name || "Establecimiento"}</div>
      <div class="report-title">REPORTE DE CIERRE DE CAJA</div>
      <div class="report-date">Generado el: ${new Date().toLocaleDateString("es-MX")}</div>
    </div>

    <div class="section">
      <div class="section-title">DETALLE POR FACTURADOR</div>
      <table>
        <thead>
          <tr>
            <th>FACTURADOR</th>
            ${metodosPagoArray.map(metodo => `
              <th class="text-right">${metodo.toUpperCase()}</th>
            `).join("")}
            <th class="text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(datosPorCajera).map(([cajera, metodos]) => {
      const totalCajera = Object.values(metodos).reduce((sum, monto) => sum + (monto || 0), 0);
      return `
              <tr>
                <td>${cajera}</td>
                ${metodosPagoArray.map(metodo => `
                  <td class="text-right">${formatoDinero(metodos[metodo] || 0)}</td>
                `).join("")}
                <td class="text-right text-bold">${formatoDinero(totalCajera)}</td>
              </tr>
            `;
    }).join("")}
          <tr class="grand-total">
            <td class="text-bold">TOTAL GENERAL</td>
            ${metodosPagoArray.map(metodo => `
              <td class="text-right text-bold">${formatoDinero(totalesPorMetodo[metodo] || 0)}</td>
            `).join("")}
            <td class="text-right text-bold">${formatoDinero(totalGeneral)}</td>
          </tr>
        </tbody>
      </table>
    </div>

     <div class="section">
      <div class="section-title">RESUMEN GENERAL</div>
      <table class="summary-table">
        <thead>
          <tr>
            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: left;">MÉTODO DE PAGO</th>
            <th style="padding: 10px; border-bottom: 2px solid #ddd; text-align: right;">MONTO</th>
          </tr>
        </thead>
        <tbody>
           ${metodosPagoArray.map(metodo => `
              <tr>
                <td class="text-bold" style="padding: 8px 10px; border-bottom: 1px solid #eee; color: #555;">${metodo.toUpperCase()}</td>
                <td class="text-right" style="padding: 8px 10px; border-bottom: 1px solid #eee;">${formatoDinero(totalesPorMetodo[metodo] || 0)}</td>
              </tr>
            `).join("")}
          <tr class="grand-total">
            <td class="text-bold" style="padding: 12px 10px; font-size: 14px;">TOTAL INGRESOS</td>
            <td class="text-right text-bold" style="padding: 12px 10px; font-size: 14px;">${formatoDinero(totalGeneral)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
  };
  useEffect(() => {
    fetchCashControlReport({
      whoDeliversIds: selectedWhoDeliversIds,
      whoValidateIds: selectedWhoValidateIds,
      startDate: selectedDate?.[0]?.toISOString() || null,
      endDate: selectedDate?.[1]?.toISOString() || null
    });
  }, [selectedWhoDeliversIds, selectedWhoValidateIds, selectedDate]);
  const rowExpansionTemplate = data => {
    return /*#__PURE__*/React.createElement("div", {
      className: "p-3"
    }, /*#__PURE__*/React.createElement("h5", {
      className: "mb-3"
    }, "Detalle por M\xE9todo de Pago"), /*#__PURE__*/React.createElement(DataTable, {
      value: data.details
    }, /*#__PURE__*/React.createElement(Column, {
      field: "payment_method.method",
      header: "M\xE9todo de Pago",
      sortable: true
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_expected",
      header: "Esperado",
      body: d => formatoDinero(d.total_expected),
      className: "text-end"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "total_received",
      header: "Recibido",
      body: d => formatoDinero(d.total_received),
      className: "text-end text-success fw-bold"
    }), /*#__PURE__*/React.createElement(Column, {
      field: "remaining_amount",
      header: "Diferencia",
      body: differenceBodyTemplate,
      className: "text-end"
    })));
  };
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-center align-items-center h-100 bg-light rounded-3 p-4"
    }, /*#__PURE__*/React.createElement("div", {
      className: "spinner-border text-primary",
      role: "status"
    }, /*#__PURE__*/React.createElement("span", {
      className: "visually-hidden"
    }, "Cargando...")));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "accordion mb-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-item"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "accordion-header",
    id: "filters"
  }, /*#__PURE__*/React.createElement("button", {
    className: "accordion-button collapsed",
    type: "button",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#filtersCollapse",
    "aria-expanded": "false",
    "aria-controls": "filtersCollapse"
  }, "Filtros")), /*#__PURE__*/React.createElement("div", {
    id: "filtersCollapse",
    className: "accordion-collapse collapse",
    "aria-labelledby": "filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "accordion-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rangoFechasCitas",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "rangoFechasCitas",
    name: "rangoFechaCitas",
    selectionMode: "range",
    dateFormat: "dd/mm/yy",
    value: selectedDate,
    onChange: e => setSelectedDate(e.value),
    className: "w-100",
    placeholder: "Seleccione un rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "who_delivers_ids",
    className: "form-label"
  }, "Entregado por"), /*#__PURE__*/React.createElement(MultiSelect, {
    inputId: "who_delivers_ids",
    options: users,
    optionLabel: "label",
    optionValue: "external_id",
    filter: true,
    placeholder: "Filtrar por usuario",
    className: "w-100",
    value: selectedWhoDeliversIds,
    onChange: e => setSelectedWhoDeliversIds(e.value),
    showClear: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "who_validate_ids",
    className: "form-label"
  }, "Validado por"), /*#__PURE__*/React.createElement(MultiSelect, {
    inputId: "who_validate_ids",
    options: users,
    optionLabel: "label",
    optionValue: "external_id",
    filter: true,
    placeholder: "Filtrar por usuario",
    className: "w-100",
    value: selectedWhoValidateIds,
    onChange: e => setSelectedWhoValidateIds(e.value),
    showClear: true
  }))))))))), /*#__PURE__*/React.createElement("div", {
    className: "card shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end gap-3"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: handleExportExcel,
    className: "btn btn-success btn-sm",
    disabled: !cashControlReportItems || cashControlReportItems.length === 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-excel me-2"
  }), "Exportar a Excel"), /*#__PURE__*/React.createElement("button", {
    onClick: handleExportPDF,
    className: "btn btn-secondary btn-sm",
    disabled: !cashControlReportItems || cashControlReportItems.length === 0
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-pdf me-2"
  }), "Exportar a PDF"))), /*#__PURE__*/React.createElement("div", {
    className: "card-header bg-light"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "h5 mb-0"
  }, "Cierre de Caja")), /*#__PURE__*/React.createElement(DataTable, {
    value: cashControlReportItems,
    expandedRows: expandedRows,
    onRowToggle: e => setExpandedRows(e.data),
    rowExpansionTemplate: rowExpansionTemplate,
    dataKey: "id",
    tableStyle: {
      minWidth: '60rem'
    }
  }, /*#__PURE__*/React.createElement(Column, {
    expander: true,
    style: {
      width: '3em'
    }
  }), /*#__PURE__*/React.createElement(Column, {
    field: "created_at",
    header: "Fecha",
    body: dateBodyTemplate,
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "total_received",
    header: "Total Recibido",
    body: d => formatoDinero(d.total_received),
    className: "text-end fw-bold text-success",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "remaining_amount",
    header: "Sobrante",
    body: differenceBodyTemplate,
    className: "text-end",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "who_delivers_name",
    header: "Entregado por",
    sortable: true
  }), /*#__PURE__*/React.createElement(Column, {
    field: "who_validate_name",
    header: "Validado por",
    sortable: true
  }))));
};