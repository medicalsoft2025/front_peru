import React, { useEffect, useState } from "react";
import {
  productService,
  userService,
  comissionConfig,
  entityService,
} from "../../services/api/index.js";
import { MultiSelect } from "primereact/multiselect";
import { Calendar } from "primereact/calendar";
import { TreeTable } from "primereact/treetable";
import { Column } from "primereact/column";
import { exportToExcel } from "../accounting/utils/ExportToExcelOptions";
import { generatePDFFromHTML } from "../../funciones/funcionesJS/exportPDF";
import { useCompany } from "../hooks/useCompany";
import { Button } from "primereact/button";
import { formatDate } from "../../services/utilidades.js";
import { useServicesFormat } from "../documents-generation/hooks/reports-medical/commissions/useServicesFormat";
import { useOrdersFormat } from "../documents-generation/hooks/reports-medical/commissions/useOrdersFormat";
import { ProgressSpinner } from "primereact/progressspinner";
import { Accordion, AccordionTab } from "primereact/accordion";
import { InputText } from "primereact/inputtext";

export const Commissions = () => {
  const today = new Date();
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 5);
  const [selectedEntities, setSelectedEntities] = useState([]);
  const [selectedProcedures, setSelectedProcedures] = useState([]);
  const [selectedEspecialistas, setSelectedEspecialistas] = useState([]);
  const [dateRange, setDateRange] = useState<any>([fiveDaysAgo, today]);
  const [comissionData, setComissionData] = useState([]);
  const [treeNodes, setTreeNodes] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState({});
  const [especialistasOptions, setEspecialistasOptions] = useState([]);
  const [proceduresOptions, setProceduresOptions] = useState([]);
  const [entitiesOptions, setEntitiesOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tab-commissions");
  const [globalFilter, setGlobalFilter] = useState("");
  const { company, setCompany, fetchCompany } = useCompany();
  const { generateFormatServices } = useServicesFormat();
  const { generateFormatOrders } = useOrdersFormat();

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      try {
        await cargarServicios();
        await cargarEspecialistas();
        await createSelectEntities();
        const filterParams = await obtenerFiltros();
        await handleTabChange("tab-commissions", filterParams);
      } catch (error) {
        console.error("Error initializing data:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const handleTabChange = async (tabId: string, filterParams: any) => {
    setActiveTab(tabId);
    setTableLoading(true);

    try {
      switch (tabId) {
        case "tab-commissions":
          const data = await comissionConfig.comissionReportServices(
            filterParams
          );
          setComissionData(data);
          formatDataToTreeNodes(data, "admissions_by_doctor");
          break;
        case "tab-orders":
          const dataToOrders = await comissionConfig.comissionReportByOrders(
            filterParams
          );
          formatDataToTreeNodes(dataToOrders, "admissions_prescriber_doctor");
          break;
        default:
          console.warn(`Tab no reconocido: ${tabId}`);
      }
    } catch (error) {
      console.error(`Error cargando datos para ${tabId}:`, error);
    } finally {
      setTableLoading(false);
    }
  };

  const cargarServicios = async () => {
    try {
      const procedimientos = await productService.getAllProducts();
      setProceduresOptions(
        procedimientos.data.map((procedure) => ({
          value: procedure.id,
          label: procedure.attributes.name,
        }))
      );
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const createSelectEntities = async () => {
    try {
      const entities = await entityService.getAll();
      setEntitiesOptions(
        entities.data.map((entity) => ({
          value: entity.id,
          label: entity.name,
        }))
      );
    } catch (error) {
      console.error("Error loading entities:", error);
    }
  };

  const cargarEspecialistas = async () => {
    try {
      const especialistas = await userService.getAllUsers();
      setEspecialistasOptions(
        especialistas.map((especialista) => ({
          value: especialista.id,
          label: `${especialista.first_name} ${especialista.last_name} - ${
            especialista.specialty?.name || "Sin especialidad"
          }`,
        }))
      );
    } catch (error) {
      console.error("Error loading specialists:", error);
    }
  };

  const obtenerDatos = async (filterParams = {}) => {
    await handleTabChange(activeTab, filterParams);
  };

  const formatDataToTreeNodes = (users: any[], nodeKey: string) => {
    const nodes: any = users.map((user, userIndex) => {
      const nombre = `${user.first_name || ""} ${user.last_name || ""}`.trim();
      const sumAmountTotal = user[nodeKey].reduce((total, admission) => {
        if (admission?.invoice?.sub_type === "entity") {
          const amount = parseFloat(admission.entity_authorized_amount) || 0;
          return total + amount;
        } else {
          const details = admission?.invoice?.details || [];
          const amountByPublic = details.reduce((totalDetail, detail) => {
            return totalDetail + (parseFloat(detail.amount) || 0);
          }, 0);
          return total + amountByPublic;
        }
      }, 0);

      let baseCalculationUser = 0;
      let commissionCalculatedUser = 0;
      let retentionCalculatedUser: any = 0;
      let netAmount = 0;

      const children =
        user[nodeKey]?.flatMap((admission, admissionIndex) => {
          admission.dataChild = null;
          const baseCalculation =
            (calculateBase(admission) *
              admission?.invoice?.commission?.percentage_value) /
              100 || 0;
          baseCalculationUser += baseCalculation;
          const commissionCalculation =
            calculateCommission(baseCalculation, admission) || 0;
          commissionCalculatedUser += commissionCalculation;
          const retention: any =
            calculatedRetention(commissionCalculation, admission) || 0;
          retentionCalculatedUser += retention;
          const netAmountCalculated = commissionCalculation - retention;
          netAmount += netAmountCalculated;

          admission.dataChild = {
            monto:
              admission?.invoice?.sub_type == "entity"
                ? parseInt(admission.entity_authorized_amount)
                : parseInt(admission?.invoice?.total_amount),
            base: baseCalculation,
            comision: commissionCalculation,
            retencion: retention,
            netAmount: netAmountCalculated,
          };

          return {
            key: `${userIndex}-${admissionIndex}`,
            data: {
              totalServices: "",
              monto:
                admission?.invoice?.sub_type == "entity"
                  ? admission.entity_authorized_amount
                  : admission?.invoice?.total_amount,
              base: baseCalculation,
              comision: commissionCalculation,
              retencion: retention,
              netAmount: netAmountCalculated,
              invoiceCode: admission?.invoice?.invoice_code,
              type:
                Number(admission?.entity_authorized_amount) > 0
                  ? "Entidad"
                  : "Particular",
              id: admission?.invoice?.id,
              isLeaf: true,
            },
          };
        }) || [];

      return {
        key: userIndex.toString(),
        data: {
          profesional: nombre,
          monto: parseFloat(sumAmountTotal.toFixed(2)),
          base: parseFloat(baseCalculationUser.toFixed(2)),
          comision: parseFloat(commissionCalculatedUser.toFixed(2)),
          retencion: parseFloat(retentionCalculatedUser.toFixed(2)),
          netAmount: parseFloat(netAmount.toFixed(2)),
          isLeaf: false,
          rawData: user[nodeKey],
        },
        children: children,
      };
    });

    setTreeNodes(nodes);
    const keys = nodes.reduce((acc, node) => {
      acc[node.key] = true;
      return acc;
    }, {});
    setExpandedKeys(keys);
  };

  function calculateBase(admission) {
    let resultBase = 0;
    const comissionsInDetails = admission?.invoice?.details.filter(
      (detail) => detail.commission
    ).length;
    if (admission?.invoice?.sub_type == "entity") {
      resultBase =
        (Number(admission.entity_authorized_amount) /
          admission?.invoice?.details.length) *
        comissionsInDetails;
      return resultBase;
    } else {
      resultBase =
        (admission?.invoice?.total_amount /
          admission?.invoice?.details.length) *
        comissionsInDetails;
      return resultBase;
    }
  }

  function calculateCommission(baseCalculation, admission) {
    const comissionsInDetails = admission?.invoice?.details.map((detail) => {
      return detail.commission !== null;
    }).length;
    if (admission?.invoice?.commission?.commission_type == "percentage") {
      return (
        (baseCalculation *
          Math.floor(
            parseFloat(admission?.invoice?.commission?.commission_value)
          )) /
        100
      );
    } else {
      return (
        comissionsInDetails * admission?.invoice?.commission?.commission_value
      );
    }
  }

  function calculatedRetention(commissionCalculation, admission) {
    if (admission?.invoice?.commission?.retention_type == "percentage") {
      return (
        (commissionCalculation *
          Math.floor(
            parseFloat(admission?.invoice?.commission?.value_retention)
          )) /
        100
      );
    } else {
      if (admission?.invoice?.commission !== null) {
        return (
          Math.floor(
            parseFloat(admission?.invoice?.commission?.value_retention)
          ) || 0
        );
      }
    }
  }

  function exportToPDF(data: any[], mainNode: any) {
    switch (activeTab) {
      case "tab-commissions":
        return generateFormatServices(data, mainNode, dateRange, "Impresion");
      case "tab-orders":
        return generateFormatOrders(data, mainNode, dateRange, "Impresion");
    }
  }

  const exportButtonTemplate = (node: any) => {
    if (!node.data.isLeaf) {
      return (
        <div className="d-flex gap-2">
          <Button
            className="p-button-rounded p-button-success p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              handleDescargarExcel(node.data.rawData);
            }}
            tooltip="Exportar a Excel"
            tooltipOptions={{ position: "right" }}
          >
            <i className="fa-solid fa-file-excel"></i>
          </Button>
          <Button
            className="p-button-rounded p-button-secondary p-button-sm"
            onClick={(e) => {
              e.stopPropagation();
              exportToPDF(node.data.rawData, node);
            }}
            tooltip="Exportar a PDF"
            tooltipOptions={{ position: "right" }}
          >
            <i className="fa-solid fa-file-pdf"></i>
          </Button>
        </div>
      );
    }
    return null;
  };

  const obtenerFiltros = () => {
    const paramsFilter = {
      end_date: dateRange?.[1]?.toISOString().split("T")[0] || "",
      start_date: dateRange?.[0]?.toISOString().split("T")[0] || "",
      service_ids: selectedProcedures.map((item: any) => item),
      user_ids: selectedEspecialistas.map((item: any) => item),
      entity_ids: selectedEntities.map((item: any) => item),
    };

    return paramsFilter;
  };

  const handleFilterClick = async () => {
    const paramsFilter = await obtenerFiltros();
    await obtenerDatos(paramsFilter);
  };

  const formatCurrency = (value: number) => {
    if (isNaN(value)) value = 0;
    return value.toLocaleString("es-CO", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      style: "currency",
      currency: "COP",
    });
  };

  const handleDescargarExcel = (commission: any) => {
    const commissionDataExport = handleDataExport(commission);

    exportToExcel({
      data: commissionDataExport,
      fileName: `Comisiones`,
    });
  };

  function handleDataExport(commission) {
    const data = commission.map((item: any) => {
      return {
        paciente: `${item.patient.first_name ?? " "} ${
          item.patient.middle_name ?? " "
        }${item.patient.last_name ?? " "}${
          item.patient.second_last_name ?? " "
        }`,
        numero_documento: item.patient.document_number,
        fecha: formatDate(item.created_at, true),
        producto: item.appointment.product.attributes.name,
        monto_entidad: item.entity_authorized_amount,
        monto_paciente: item?.invoice?.total_amount ?? 0,
        invoice_code: item?.invoice?.invoice_code ?? "",
        id: item?.invoice?.id ?? "",
      };
    });

    return data;
  }

  const amountTemplate = (node: any) => formatCurrency(node.data.monto);
  const invoiceCodeTemplate = (node: any) => node.data.invoiceCode;
  const idTemplate = (node: any) => node.data.id;
  const baseTemplate = (node: any) => formatCurrency(node.data.base);
  const commissionTemplate = (node: any) => formatCurrency(node.data.comision);
  const retentionTemplate = (node: any) => formatCurrency(node.data.retencion);
  const netAmountTemplate = (node: any) => formatCurrency(node.data.netAmount);
  const typeTemplate = (node: any) => node.data.type;
  const profesionalTemplate = (node: any) =>
    node.data.isLeaf ? (
      <span style={{ paddingLeft: "30px" }}>{node.data.profesional}</span>
    ) : (
      <strong>{node.data.profesional}</strong>
    );

  const renderTabContent = () => {
    if (tableLoading) {
      return (
        <div
          className="flex justify-content-center align-items-center"
          style={{ height: "200px" }}
        >
          <ProgressSpinner />
        </div>
      );
    }

    if (treeNodes.length === 0) {
      return <p>No hay datos para mostrar</p>;
    }

    return (
      <div className="card">
        <TreeTable
          value={treeNodes}
          expandedKeys={expandedKeys}
          onToggle={(e) => setExpandedKeys(e.value)}
          scrollable
          scrollHeight="600px"
          className="p-datatable-sm p-datatable-striped"
          showGridlines
        >
          <Column
            field="profesional"
            header="Profesional"
            body={profesionalTemplate}
            expander
            style={{ minWidth: "200px" }}
          />
          <Column
            field="id"
            header="Id Factura"
            body={idTemplate}
            style={{ minWidth: "120px" }}
          />
          <Column
            field="invoiceCode"
            header="Código Factura"
            body={invoiceCodeTemplate}
            style={{ minWidth: "150px" }}
          />
          <Column
            field="monto"
            header="Monto"
            body={amountTemplate}
            style={{ minWidth: "150px" }}
          />
          <Column
            field="base"
            header="Base Cálculo"
            body={baseTemplate}
            style={{ minWidth: "150px" }}
          />
          <Column
            field="comision"
            header="Comisión"
            body={commissionTemplate}
            style={{ minWidth: "150px" }}
          />
          <Column
            field="retencion"
            header="Retención"
            body={retentionTemplate}
            style={{ minWidth: "150px" }}
          />
          <Column
            field="netAmount"
            header="Neto a pagar"
            body={netAmountTemplate}
            style={{ minWidth: "150px" }}
          />
          <Column
            field="Type"
            header="Tipo"
            body={typeTemplate}
            style={{ minWidth: "120px" }}
          />
          <Column
            field="exportar"
            header="Exportar"
            body={exportButtonTemplate}
            style={{ minWidth: "120px" }}
          />
        </TreeTable>
        <div className="row align-items-center justify-content-between pe-0 fs-9 mt-3">
          <div className="col-auto d-flex">
            <p className="mb-0 d-none d-sm-block me-3 fw-semibold text-body">
              Mostrando {treeNodes.length} profesionales
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "50vh" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <main className="main" id="top">
      {loading ? (
        <div
          className="flex justify-content-center align-items-center"
          style={{
            height: "50vh",
            marginLeft: "900px",
            marginTop: "300px",
          }}
        >
          <ProgressSpinner />
        </div>
      ) : (
        <>
          <div className="row g-3 justify-content-between align-items-start mb-4">
            <div className="col-12">
              <div
                className="card mb-3 text-body-emphasis rounded-3 p-3 w-100 w-md-100 w-lg-100 mx-auto"
                style={{ minHeight: "400px" }}
              >
                <div className="card-body h-100 w-100 d-flex flex-column" style={{ marginTop: "-40px" }}>
                  <div className="tabs-professional-container mt-4">
                    <Accordion>
                      <AccordionTab header="Filtros">
                        <div className="row">
                          <div className="col-12 col-md-6 mb-3">
                            <label
                              className="form-label"
                              htmlFor="dateRange"
                            >
                              Fecha inicio - fin Procedimiento
                            </label>
                            <Calendar
                              value={dateRange}
                              onChange={(e: any) => setDateRange(e.value)}
                              selectionMode="range"
                              readOnlyInput
                              dateFormat="dd/mm/yy"
                              placeholder="Seleccione un rango de fechas"
                              className="w-100"
                              showIcon
                            />
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">
                              Profesional
                            </label>
                            <MultiSelect
                              value={selectedEspecialistas}
                              options={especialistasOptions}
                              onChange={(e) =>
                                setSelectedEspecialistas(e.value)
                              }
                              optionLabel="label"
                              placeholder="Seleccione profesionales"
                              className="w-100"
                              filter
                              display="chip"
                              maxSelectedLabels={3}
                            />
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">
                              Servicios
                            </label>
                            <MultiSelect
                              value={selectedProcedures}
                              options={proceduresOptions}
                              onChange={(e) =>
                                setSelectedProcedures(e.value)
                              }
                              optionLabel="label"
                              placeholder="Seleccione procedimientos"
                              className="w-100"
                              display="chip"
                              maxSelectedLabels={3}
                            />
                          </div>
                          <div className="col-12 col-md-6 mb-3">
                            <label className="form-label">
                              Entidades
                            </label>
                            <MultiSelect
                              value={selectedEntities}
                              options={entitiesOptions}
                              onChange={(e) =>
                                setSelectedEntities(e.value)
                              }
                              optionLabel="label"
                              placeholder="Seleccione entidades"
                              className="w-100"
                              display="chip"
                              maxSelectedLabels={3}
                            />
                          </div>
                          <div className="col-12">
                            <div className="d-flex justify-content-end m-2">
                              <Button
                                label="Filtrar"
                                icon="pi pi-filter"
                                onClick={handleFilterClick}
                                loading={tableLoading}
                                className="p-button-primary"
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionTab>
                    </Accordion>
                    <div className="tabs-header">
                      <button
                        className={`tab-item ${activeTab === "tab-commissions" ? "active" : ""}`}
                        onClick={() => handleTabChange("tab-commissions", obtenerFiltros())}
                      >
                        <i className="fas fa-stethoscope"></i>
                        Servicios
                      </button>
                      <button
                        className={`tab-item ${activeTab === "tab-orders" ? "active" : ""}`}
                        onClick={() => handleTabChange("tab-orders", obtenerFiltros())}
                      >
                        <i className="fas fa-file-prescription"></i>
                        Órdenes
                      </button>
                    </div>

                    <div className="tabs-content">
                      {/* Panel de Servicios */}
                      <div className={`tab-panel ${activeTab === "tab-commissions" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Comisiones por Servicios</span>
                          <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                              type="search"
                              onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                              placeholder="Buscar..."
                            />
                          </span>
                        </div>
                        {renderTabContent()}
                      </div>

                      {/* Panel de Órdenes */}
                      <div className={`tab-panel ${activeTab === "tab-orders" ? "active" : ""}`}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                          <span className="text-xl font-semibold">Comisiones por Órdenes</span>
                          <span className="p-input-icon-left">
                            <i className="pi pi-search" />
                            <InputText
                              type="search"
                              onInput={(e) => setGlobalFilter(e.currentTarget.value)}
                              placeholder="Buscar..."
                            />
                          </span>
                        </div>
                        {renderTabContent()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <style>
        {`   
      th
      {
        background-color: #007bff !important;
        color: white !important;
        }
   `}
      </style>
    </main>
  );
};