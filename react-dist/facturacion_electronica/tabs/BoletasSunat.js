import React, { useState, useRef, useEffect } from "react";
import { Toast } from "primereact/toast";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Tag } from "primereact/tag";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { useBoletas } from "../hooks/useBoletas.js";
import { TableMenuActions } from "../const/MenuItems.js";
import { boletasService } from "../../../services/api/index.js";
export const BoletasSunat = () => {
  const toast = useRef(null);
  const {
    boletas,
    getBoletas,
    loading
  } = useBoletas();
  useEffect(() => {
    getBoletas();
  }, []);
  // Estado para los filtros (solo visual)
  const [filtros, setFiltros] = useState({
    numeroFactura: "",
    cliente: "",
    fechaRango: null,
    tipoFactura: null,
    estado: null
  });
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex align-items-center justify-content-center",
      style: {
        gap: "0.5rem",
        minWidth: "120px"
      }
    }, /*#__PURE__*/React.createElement(TableMenuActions, {
      rowData: rowData
    }));
  };
  async function generateSummarySunat() {
    try {
      const payload = {
        company_id: 1,
        branch_id: 1,
        fecha_resumen: new Date().toISOString().split("T")[0]
      };
      const response = await boletasService.resumenDiarioFecha(payload);
      toast.current?.show({
        severity: "success",
        summary: "Resumen generado!",
        detail: response.message,
        life: 5000
      });
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 5000
      });
      console.error("Error al generar el resumen:", error);
    }
  }

  // Manejadores de cambio de filtros (solo visual)
  const handleFilterChange = (field, value) => {
    setFiltros(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const columns = [{
    field: "numero_completo",
    header: "Factura",
    sortable: true
  }, {
    field: "fecha_emision",
    header: "Fecha",
    sortable: true
  }, {
    field: "cliente",
    header: "Cliente",
    sortable: true,
    body: rowData => rowData.cliente?.razon_social
  }, {
    field: "documento",
    header: "Documento",
    sortable: true,
    body: rowData => rowData.cliente?.numero_documento
  }, {
    field: "totales",
    header: "Monto Total",
    sortable: true,
    body: rowData => rowData.totales?.total?.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })
  }, {
    field: "Gravada",
    header: "Gravadas",
    sortable: true,
    body: rowData => rowData.totales?.gravada?.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP"
    })
  }, {
    field: "estado_sunat",
    header: "Estado SUNAT",
    sortable: true,
    body: rowData => /*#__PURE__*/React.createElement(Tag, {
      value: rowData.estado_sunat,
      severity: rowData.estado_sunat === "ACEPTADO" ? "success" : rowData.estado_sunat === "RECHAZADO" ? "danger" : "warning"
    })
  },
  // {
  //   field: "actions",
  //   header: "Acciones",
  //   body: (rowData: BoletaModel) => (
  //     <Button
  //       icon="pi pi-cog"
  //       className="p-button-text"
  //       onClick={() => console.log("Boleta:", rowData.numero_completo)}
  //     />
  //   ),

  //   width: "120px",
  // },
  {
    field: "actions",
    header: "Acciones",
    body: rowData => actionBodyTemplate(rowData),
    //exportable: false,
    width: "120px"
  }];
  return /*#__PURE__*/React.createElement("main", {
    className: "main w-100",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: " h-100 w-100 d-flex flex-column",
    style: {
      marginTop: "-30px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center pt-3 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    style: {
      marginLeft: "70px"
    },
    className: "p-button-secondary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-pdf me-2"
  }), "Exportar a PDF")), /*#__PURE__*/React.createElement(Button, {
    className: "p-button-primary",
    onClick: () => window.location.href = "Facturacion_Ventas"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-file-edit me-2"
  }), "Nueva Boleta")), /*#__PURE__*/React.createElement(Accordion, null, /*#__PURE__*/React.createElement(AccordionTab, {
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
    options: [],
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
    options: [],
    onChange: e => handleFilterChange("estado", e.value),
    placeholder: "Seleccione estado",
    className: "w-100"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Limpiar",
    icon: "pi pi-trash",
    className: "p-button-secondary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Aplicar Filtros",
    icon: "pi pi-filter",
    className: "p-button-primary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Generar resumen",
    icon: "pi pi-filter",
    className: "p-button-info",
    onClick: () => generateSummarySunat()
    // disabled={!filtros?.fechaRango?.length}
  }))))), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: boletas,
    loading: loading,
    onSearch: () => {},
    onReload: getBoletas,
    lazy: false,
    rows: 10,
    first: 0,
    totalRecords: boletas.length
  }))), /*#__PURE__*/React.createElement(Toast, {
    ref: toast
  }));
};