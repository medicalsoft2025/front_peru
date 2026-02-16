import React from "react";
import ReactDOMServer from "react-dom/server";
import { Sales607Format } from "../../../formats/billing/tax-report/607SalesFormat.js";
import { useGeneratePDF } from "../../useGeneratePDF.js";
export const use607SalesFormatFormat = () => {
  const {
    generatePDF
  } = useGeneratePDF();
  function generateFormat607SalesFormat(mainData, type) {
    const namePDF = `Reporte-Fiscal-607-Ventas`;
    const html = ReactDOMServer.renderToStaticMarkup(/*#__PURE__*/React.createElement(Sales607Format, {
      invoices: mainData
    }));
    generatePDF({
      html: html,
      pdfName: namePDF,
      type: type,
      dimensions: [842, 595]
    });
  }
  return {
    generateFormat607SalesFormat
  };
};