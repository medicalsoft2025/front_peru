import React from "react";
import { statusInvoices } from "../../../../../services/commons.js";
export const Purchases606FormatFormat = ({
  invoices
}) => {
  // Función para formatear currency (igual que en el primer componente)
  const formatCurrency = value => {
    const formatted = new Intl.NumberFormat("es-DO", {
      style: "currency",
      currency: "DOP",
      minimumFractionDigits: 2
    }).format(value);
    return formatted.replace("RD$", "$");
  };

  // Función para formatear fechas
  const formatDate = (date, includeYear = false) => {
    if (typeof date === "string") {
      date = new Date(date);
    }
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    if (includeYear) {
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return `${day}/${month}`;
  };

  // Función para determinar el tipo de identificación
  const getDocumentType = documentType => {
    switch (documentType) {
      case "RNC":
        return 1;
      case "CC":
        return 2;
      default:
        return 3;
    }
  };
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

  // Estilos base para celdas
  const cellStyle = {
    padding: "2px 2px",
    // Reducido drásticamente
    border: "1px solid #dee2e6",
    fontSize: "9px",
    // Reducido para que quepan 20 columnas
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  };
  const headerStyle = {
    ...cellStyle,
    textAlign: "center",
    backgroundColor: "#f8f9fa",
    fontWeight: "bold",
    color: "#000",
    fontSize: "8px",
    // Un poco más pequeño para los encabezados largos
    whiteSpace: "normal",
    // Permitir wrap en encabezados
    verticalAlign: "bottom"
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: "0",
      border: "none",
      padding: "0",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("style", null, `
          @media print {
            @page {
              size: landscape;
              margin: 5mm; 
            }
            body {
              -webkit-print-color-adjust: exact;
            }
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
            font-size: 9px;
            table-layout: fixed; /* Forzar ancho equitativo o controlado */
          }
          
          .user-header {
            text-align: center; 
            margin-bottom: 0.5rem; 
            background-color: #424a51; 
            color: white; 
            padding: 5px;
            border-radius: 4px;
          }
        `), /*#__PURE__*/React.createElement("div", {
    className: "print-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user-header"
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: "14px"
    }
  }, "Reporte 606 - Compras de Bienes y Servicios")), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle,
      width: "25px"
    }
  }, "Id"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle,
      width: "105px"
    }
  }, "RNC/C\xE9dula"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle,
      width: "20px"
    }
  }, "Tipo"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle,
      width: "85px"
    }
  }, "NCF"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle,
      width: "60px"
    }
  }, "Tipo Ingreso"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle,
      width: "55px"
    }
  }, "Fecha Comp."), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Monto Facturado"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "ITBIS Fact."), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "ISR Retenido"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "ISC"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Otros Imp."), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Efectivo"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Cheque/ Transf."), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Tarjeta"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Cr\xE9dito"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Bonos"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Permuta"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle
    }
  }, "Otras"), /*#__PURE__*/React.createElement("th", {
    style: {
      ...headerStyle,
      width: "60px"
    }
  }, "Estado"))), /*#__PURE__*/React.createElement("tbody", null, invoices.map((detail, index) => /*#__PURE__*/React.createElement("tr", {
    key: index
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "center"
    }
  }, detail.id || index + 1), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "left"
    }
  }, detail.third_party?.document_number || ""), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "center"
    }
  }, getDocumentType(detail.third_party?.document_type)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "left"
    }
  }, detail.invoice_code || ""), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "center"
    }
  }, getIncomeType(detail.income_type?.accounting_account?.category || "")), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "center"
    }
  }, formatDate(detail.created_at, true)), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(Number(detail.total_amount) || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.itbis_factured || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.tax_isr_received || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.consumption_tax || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(Number(detail.iva) || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.payment_cash || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.payment_transfer || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.payment_card || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.payment_credit || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.payment_gift_certificate || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.payment_swap || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "right"
    }
  }, `$${(detail.payment_default || 0).toFixed(2)}`), /*#__PURE__*/React.createElement("td", {
    style: {
      ...cellStyle,
      textAlign: "center"
    }
  }, statusInvoices[detail.status]?.slice(0, 10) || "")))))));
};