import React from "react";
import ReactDOMServer from "react-dom/server";
import { Purchases606FormatFormat } from "../../../formats/billing/tax-report/606PurchasesFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const use606PurchasesFormatFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormat606PurchasesFormat(mainData, type) {
    const namePDF = `Reporte-Fiscal-606-Compras`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(Purchases606FormatFormat, {
      invoices: mainData
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      orientation: "landscape"
    });
  }
  return {
    generateFormat606PurchasesFormat
  };
};