import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import React, { useRef } from "react";
import { useBoletas } from "../hooks/useBoletas.js";
export const TableMenuActions = ({
  rowData
}) => {
  const menu = useRef(null);

  // 📌 Aquí usamos el hook
  const {
    descargarPdfBoleta,
    descargarXmlBoleta,
    descargarCdrBoleta
  } = useBoletas();
  const handlePrintInvoice = async () => {
    try {
      // Descarga el PDF como Blob
      const blob = await descargarPdfBoleta(rowData.id);

      // Verifica que sea un Blob
      if (!(blob instanceof Blob)) {
        throw new Error("La respuesta no es un Blob válido");
      }

      // Crea un URL temporal para el Blob
      const url = window.URL.createObjectURL(blob);

      // Abre en otra pestaña
      const newTab = window.open(url, "_blank");
      if (!newTab) {
        alert("Permite ventanas emergentes en tu navegador para ver el PDF.");
      }

      // Revoca el objeto después de 10 segundos para liberar memoria
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Error al abrir PDF:", err);
    }
  };
  const handleDownloadPdf = async () => {
    try {
      // Descarga el PDF como Blob
      const blob = await descargarPdfBoleta(rowData.id);
      if (!(blob instanceof Blob)) {
        throw new Error("La respuesta no es un Blob válido");
      }

      // Crea un URL temporal
      const url = window.URL.createObjectURL(blob);

      // Crea un enlace y fuerza la descarga
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `boleta_${rowData.numero_completo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Revoca el objeto después de 10 segundos
      setTimeout(() => window.URL.revokeObjectURL(url), 10000);
    } catch (err) {
      console.error("Error al descargar PDF:", err);
    }
  };
  const handleDownloadXml = async () => {
    try {
      const response = await descargarXmlBoleta(rowData.id);
      const blob = new Blob([response], {
        type: "application/xml"
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `boleta_${rowData.numero_completo}.xml`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error al descargar XML:", err);
    }
  };
  const handleDownloadCdr = async () => {
    try {
      const response = await descargarCdrBoleta(rowData.id);
      const blob = new Blob([response], {
        type: "application/zip"
      }); // si el CDR viene comprimido
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `boleta_${rowData.numero_completo}_cdr.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error al descargar CDR:", err);
    }
  };
  const menuItems = [{
    label: "Imprimir",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-print me-2"
    }),
    command: handlePrintInvoice
  }, {
    label: "Descargar PDF",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-pdf me-2"
    }),
    command: handleDownloadPdf
  }, {
    label: "Descargar XML",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-code me-2"
    }),
    command: handleDownloadXml
  }, {
    label: "Descargar CDR",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-file-archive me-2"
    }),
    command: handleDownloadCdr
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary flex items-center gap-2",
    onClick: e => menu.current?.toggle(e),
    "aria-controls": `popup_menu_${rowData.id}`,
    "aria-haspopup": true
  }, "Acciones", /*#__PURE__*/React.createElement("i", {
    className: "fas fa-cog ml-2"
  })), /*#__PURE__*/React.createElement(Menu, {
    model: menuItems,
    popup: true,
    ref: menu,
    id: `popup_menu_${rowData.id}`,
    appendTo: document.body,
    style: {
      zIndex: 9999
    }
  }));
};