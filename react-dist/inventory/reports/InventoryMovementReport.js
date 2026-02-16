import React, { useState, useMemo } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { useInventoryMovementReport } from "../hooks/useInventoryMovementReport.js";
import { GeneralInventoryTable } from "./components/GeneralInventoryTable.js";
import { EntriesTable } from "./components/EntriesTable.js";
import { ExitsTable } from "./components/ExitsTable.js";
import { TransfersTable } from "./components/TransfersTable.js";
import { InventoryTransferModal } from "./components/InventoryTransferModal.js";
import { formatCurrency } from "./components/utils.js";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useBranchesForSelect } from "../../branches/hooks/useBranchesForSelect.js";
import { useCompanies } from "../../companies/hooks/useCompanies.js";
import { useDeposits } from "../deposits/hooks/useDeposits.js";
export const InventoryMovementReport = () => {
  // Hook para obtener los datos del reporte
  const {
    reportData,
    loading,
    dateRange,
    setDateRange,
    refreshReport
  } = useInventoryMovementReport();

  // Hooks for filters
  const {
    branches,
    loading: loadingBranches
  } = useBranchesForSelect();
  const {
    companies,
    loading: loadingCompanies
  } = useCompanies();
  const {
    deposits,
    loading: loadingDeposits
  } = useDeposits();
  const [expandedRows, setExpandedRows] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [branchId, setBranchId] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [depositId, setDepositId] = useState(null);
  const [type, setType] = useState(null);
  const formatDateForAPI = date => {
    return date.toISOString().split('T')[0];
  };
  React.useEffect(() => {
    const filters = {};
    if (dateRange && dateRange[0]) filters.start_date = formatDateForAPI(dateRange[0]);
    if (dateRange && dateRange[1]) filters.end_date = formatDateForAPI(dateRange[1]);
    if (branchId) filters.branch_id = branchId;
    if (companyId) filters.company_id = companyId;
    if (depositId) filters.deposit_id = depositId;
    if (type) filters.type = type;
    if (dateRange || branchId || companyId || depositId || type) {
      refreshReport(filters);
    } else {
      refreshReport({}); // Ensure refresh when all filters are cleared
    }
  }, [dateRange, branchId, companyId, depositId, type]);
  const typeOptions = [{
    label: 'Farmacia',
    value: 'PHARMACY'
  }, {
    label: 'Caja POS',
    value: 'POS_BOX'
  }, {
    label: 'Insumos Clínicos',
    value: 'CLINICAL_SUPPLIES'
  }];

  // Helper to map companies/deposits to Dropdown options if needed
  // useBranchesForSelect returns {value, label}. others might return raw objects.
  const companyOptions = companies.map(c => ({
    label: c.attributes.legal_name,
    value: c.id
  }));
  const depositOptions = deposits.map(d => ({
    label: d.attributes.name,
    value: d.id
  }));

  // Consolidated Data Processing Logic
  const {
    allMovementsCount,
    totalValue,
    entriesDeposits,
    exitsDeposits,
    transfersDeposits,
    entriesTotalValue,
    exitsTotalValue,
    transfersTotalValue,
    entriesCount,
    exitsCount,
    transfersCount
  } = useMemo(() => {
    let allMovementsCount = 0;
    let totalValue = 0;
    let entriesCount = 0;
    let entriesTotalValue = 0;
    let exitsCount = 0;
    let exitsTotalValue = 0;
    let transfersCount = 0;
    let transfersTotalValue = 0;
    const processDeposits = filterFn => {
      if (!reportData) return [];
      return reportData.map(deposit => {
        const filteredMovements = (deposit.movements || []).map(m => {
          // Enrich movement with deposit context if needed, though we passed it in the table
          // We also need to process source/dest for transfers here if we want them consistent
          // But the previous flatness logic did that. Now we are inside a deposit.
          // So we just need to ensure the movements inside the deposit have the "Transfer" logic applied if they are transfer.
          return m;
        }).filter(filterFn);
        if (filteredMovements.length === 0) return null;
        const depTotalValue = filteredMovements.reduce((sum, m) => {
          return sum + Number(m.total_with_tax || 0);
        }, 0);
        return {
          ...deposit,
          movements: filteredMovements.map(m => {
            // Apply transfer logic enrichment here for the inner table
            if (isTransfer(m)) {
              let source_deposit_name = "";
              let destination_deposit_name = "";
              if (m.type === "exit") {
                source_deposit_name = deposit.deposit_name;
                destination_deposit_name = m.related_deposit?.name || "Desconocido";
              } else {
                source_deposit_name = m.related_deposit?.name || "Desconocido";
                destination_deposit_name = deposit.deposit_name;
              }
              return {
                ...m,
                source_deposit_name,
                destination_deposit_name
              };
            }
            return m;
          }),
          total_movements_count: filteredMovements.length,
          total_value: depTotalValue
        };
      }).filter(d => d !== null);
    };

    // Heuristics to identify movement types
    const isTransfer = m => (m.related_deposit || m.related_deposit_type) && !m.invoice;
    const isEntry = m => m.type === "entry" && !isTransfer(m);
    const isExit = m => m.type === "exit" && !isTransfer(m);

    // General Totals (using raw reportData)
    if (reportData) {
      reportData.forEach(d => {
        if (d.movements) {
          allMovementsCount += d.movements.length;
          d.movements.forEach(m => {
            const rawVal = m.total_with_tax || 0;
            const val = Number(rawVal);
            if (m.type === 'entry') {
              totalValue += val;
            } else if (m.type === 'exit') {
              totalValue -= val;
            }
          });
        }
      });
    }
    const entriesDeposits = processDeposits(isEntry);
    const exitsDeposits = processDeposits(isExit);
    const transfersDeposits = processDeposits(isTransfer);

    // Calculate specific totals
    entriesDeposits.forEach(d => {
      entriesCount += d.total_movements_count;
      entriesTotalValue += d.total_value;
    });
    exitsDeposits.forEach(d => {
      exitsCount += d.total_movements_count;
      exitsTotalValue += d.total_value;
    });
    transfersDeposits.forEach(d => {
      transfersCount += d.total_movements_count;
      transfersTotalValue += d.total_value;
    });
    return {
      allMovementsCount,
      totalValue,
      entriesDeposits,
      exitsDeposits,
      transfersDeposits,
      entriesTotalValue,
      exitsTotalValue,
      transfersTotalValue,
      entriesCount,
      exitsCount,
      transfersCount
    };
  }, [reportData]);

  // Footer for the General Table
  const footerTotales = /*#__PURE__*/React.createElement("div", {
    className: "grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Dep\xF3sitos:"), " ", reportData.length), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Total Movimientos:"), " ", allMovementsCount), /*#__PURE__*/React.createElement("div", {
    className: "col-12 md:col-4"
  }, /*#__PURE__*/React.createElement("strong", null, "Valor Total Movido:"), " ", formatCurrency(totalValue)));
  return /*#__PURE__*/React.createElement("div", {
    className: "container-fluid mt-4",
    style: {
      padding: "0 15px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", null, "Reporte de Movimientos de Inventario"), /*#__PURE__*/React.createElement(Button, {
    label: "Realizar Traslado",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fas fa-exchange-alt me-2"
    }),
    className: "p-button-success",
    onClick: () => setShowTransferModal(true)
  })), /*#__PURE__*/React.createElement(Accordion, {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement(AccordionTab, {
    header: /*#__PURE__*/React.createElement("div", {
      className: "d-flex align-items-center"
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-filter me-2"
    }), "Filtros")
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "dateRange",
    className: "form-label"
  }, "Rango de fechas"), /*#__PURE__*/React.createElement(Calendar, {
    id: "dateRange",
    selectionMode: "range",
    value: dateRange,
    onChange: e => setDateRange(e.value),
    className: "w-100",
    showIcon: true,
    dateFormat: "dd/mm/yy",
    placeholder: "Seleccione rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Sucursal"), /*#__PURE__*/React.createElement(Dropdown, {
    value: branchId,
    options: branches,
    onChange: e => setBranchId(e.value),
    placeholder: "Todas",
    className: "w-100",
    showClear: true,
    loading: loadingBranches
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Empresa"), /*#__PURE__*/React.createElement(Dropdown, {
    value: companyId,
    options: companyOptions,
    onChange: e => setCompanyId(e.value),
    placeholder: "Todas",
    className: "w-100",
    showClear: true,
    loading: loadingCompanies
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Dep\xF3sito"), /*#__PURE__*/React.createElement(Dropdown, {
    value: depositId,
    options: depositOptions,
    onChange: e => setDepositId(e.value),
    placeholder: "Todos",
    className: "w-100",
    showClear: true,
    filter: true,
    loading: loadingDeposits
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label"
  }, "Tipo Dep\xF3sito"), /*#__PURE__*/React.createElement(Dropdown, {
    value: type,
    options: typeOptions,
    onChange: e => setType(e.value),
    placeholder: "Todos",
    className: "w-100",
    showClear: true
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "row mt-4 mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Valor Total Entradas"), /*#__PURE__*/React.createElement("h3", {
    className: "text-success"
  }, formatCurrency(entriesTotalValue)), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, entriesCount, " movimientos")))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Valor Total Salidas"), /*#__PURE__*/React.createElement("h3", {
    className: "text-danger"
  }, formatCurrency(exitsTotalValue)), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, exitsCount, " movimientos")))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Valor Traslados"), /*#__PURE__*/React.createElement("h3", {
    className: "text-info"
  }, formatCurrency(transfersTotalValue)), /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, transfersCount, " movimientos")))), /*#__PURE__*/React.createElement("div", {
    className: "col-md-3 mb-3"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "h-100 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-muted"
  }, "Dep\xF3sitos Activos"), /*#__PURE__*/React.createElement("h3", {
    className: "text-primary"
  }, reportData.filter(d => d.is_active).length))))), /*#__PURE__*/React.createElement(Card, {
    className: "shadow-sm"
  }, /*#__PURE__*/React.createElement(TabView, {
    activeIndex: activeIndex,
    onTabChange: e => setActiveIndex(e.index)
  }, /*#__PURE__*/React.createElement(TabPanel, {
    header: "General"
  }, /*#__PURE__*/React.createElement(GeneralInventoryTable, {
    reportData: reportData,
    loading: loading,
    expandedRows: expandedRows,
    setExpandedRows: setExpandedRows,
    footerTotales: footerTotales
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Entradas"
  }, /*#__PURE__*/React.createElement(EntriesTable, {
    deposits: entriesDeposits,
    loading: loading
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Salidas"
  }, /*#__PURE__*/React.createElement(ExitsTable, {
    deposits: exitsDeposits,
    loading: loading
  })), /*#__PURE__*/React.createElement(TabPanel, {
    header: "Traslados"
  }, /*#__PURE__*/React.createElement(TransfersTable, {
    deposits: transfersDeposits,
    loading: loading
  })))), /*#__PURE__*/React.createElement(InventoryTransferModal, {
    visible: showTransferModal,
    onHide: () => setShowTransferModal(false),
    onSuccess: () => {
      refreshReport({}); // Refresh report on success
    }
  }));
};