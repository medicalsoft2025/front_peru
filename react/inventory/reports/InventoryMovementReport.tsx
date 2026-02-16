import React, { useState, useMemo } from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { useInventoryMovementReport } from "../hooks/useInventoryMovementReport";
import { GeneralInventoryTable } from "./components/GeneralInventoryTable";
import { EntriesTable } from "./components/EntriesTable";
import { ExitsTable } from "./components/ExitsTable";
import { TransfersTable } from "./components/TransfersTable";
import { InventoryTransferModal } from "./components/InventoryTransferModal";
import { formatCurrency } from "./components/utils";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useBranchesForSelect } from '../../branches/hooks/useBranchesForSelect';
import { useCompanies } from '../../companies/hooks/useCompanies';
import { useDeposits } from '../deposits/hooks/useDeposits';

export const InventoryMovementReport: React.FC = () => {
    // Hook para obtener los datos del reporte
    const {
        reportData,
        loading,
        dateRange,
        setDateRange,
        refreshReport
    } = useInventoryMovementReport();

    // Hooks for filters
    const { branches, loading: loadingBranches } = useBranchesForSelect();
    const { companies, loading: loadingCompanies } = useCompanies();
    const { deposits, loading: loadingDeposits } = useDeposits();

    const [expandedRows, setExpandedRows] = useState<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [showTransferModal, setShowTransferModal] = useState(false);

    const [branchId, setBranchId] = useState<any>(null);
    const [companyId, setCompanyId] = useState<any>(null);
    const [depositId, setDepositId] = useState<any>(null);
    const [type, setType] = useState<any>(null);

    const formatDateForAPI = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    React.useEffect(() => {
        const filters: any = {};
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

    const typeOptions = [
        { label: 'Farmacia', value: 'PHARMACY' },
        { label: 'Caja POS', value: 'POS_BOX' },
        { label: 'Insumos Clínicos', value: 'CLINICAL_SUPPLIES' }
    ];

    // Helper to map companies/deposits to Dropdown options if needed
    // useBranchesForSelect returns {value, label}. others might return raw objects.
    const companyOptions = companies.map((c: any) => ({ label: c.attributes.legal_name, value: c.id }));
    const depositOptions = deposits.map((d: any) => ({ label: d.attributes.name, value: d.id }));

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

        const processDeposits = (filterFn: (m: any) => boolean) => {
            if (!reportData) return [];
            return reportData.map(deposit => {
                const filteredMovements = (deposit.movements || [])
                    .map((m: any) => {
                        // Enrich movement with deposit context if needed, though we passed it in the table
                        // We also need to process source/dest for transfers here if we want them consistent
                        // But the previous flatness logic did that. Now we are inside a deposit.
                        // So we just need to ensure the movements inside the deposit have the "Transfer" logic applied if they are transfer.
                        return m;
                    })
                    .filter(filterFn);

                if (filteredMovements.length === 0) return null;

                const depTotalValue = filteredMovements.reduce((sum: number, m: any) => {
                    return sum + Number(m.total_with_tax || 0);
                }, 0);

                return {
                    ...deposit,
                    movements: filteredMovements.map((m: any) => {
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
                            return { ...m, source_deposit_name, destination_deposit_name };
                        }
                        return m;
                    }),
                    total_movements_count: filteredMovements.length,
                    total_value: depTotalValue
                };
            }).filter(d => d !== null);
        };

        // Heuristics to identify movement types
        const isTransfer = (m: any) => (m.related_deposit || m.related_deposit_type) && !m.invoice;
        const isEntry = (m: any) => m.type === "entry" && !isTransfer(m);
        const isExit = (m: any) => m.type === "exit" && !isTransfer(m);

        // General Totals (using raw reportData)
        if (reportData) {
            reportData.forEach(d => {
                if (d.movements) {
                    allMovementsCount += d.movements.length;
                    d.movements.forEach((m: any) => {
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
        entriesDeposits.forEach((d: any) => {
            entriesCount += d.total_movements_count;
            entriesTotalValue += d.total_value;
        });
        exitsDeposits.forEach((d: any) => {
            exitsCount += d.total_movements_count;
            exitsTotalValue += d.total_value;
        });
        transfersDeposits.forEach((d: any) => {
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
    const footerTotales = (
        <div className="grid">
            <div className="col-12 md:col-4">
                <strong>Total Depósitos:</strong> {reportData.length}
            </div>
            <div className="col-12 md:col-4">
                <strong>Total Movimientos:</strong> {allMovementsCount}
            </div>
            <div className="col-12 md:col-4">
                <strong>Valor Total Movido:</strong>{" "}
                {formatCurrency(totalValue)}
            </div>
        </div>
    );

    return (
        <div className="container-fluid mt-4" style={{ padding: "0 15px" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Reporte de Movimientos de Inventario</h2>
                <Button
                    label="Realizar Traslado"
                    icon={<i className="fas fa-exchange-alt me-2"></i>}
                    className="p-button-success"
                    onClick={() => setShowTransferModal(true)}
                />
            </div>

            <Accordion className="mb-3">
                <AccordionTab
                    header={
                        <div className="d-flex align-items-center">
                            <i className="fas fa-filter me-2"></i>
                            Filtros
                        </div>
                    }
                >
                    <div className="row g-3">
                        <div className="col-12">
                            <label htmlFor="dateRange" className="form-label">Rango de fechas</label>
                            <Calendar
                                id="dateRange"
                                selectionMode="range"
                                value={dateRange}
                                onChange={(e) => setDateRange(e.value as any)}
                                className="w-100"
                                showIcon
                                dateFormat="dd/mm/yy"
                                placeholder="Seleccione rango"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Sucursal</label>
                            <Dropdown
                                value={branchId}
                                options={branches}
                                onChange={(e) => setBranchId(e.value)}
                                placeholder="Todas"
                                className="w-100"
                                showClear
                                loading={loadingBranches}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Empresa</label>
                            <Dropdown
                                value={companyId}
                                options={companyOptions}
                                onChange={(e) => setCompanyId(e.value)}
                                placeholder="Todas"
                                className="w-100"
                                showClear
                                loading={loadingCompanies}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Depósito</label>
                            <Dropdown
                                value={depositId}
                                options={depositOptions}
                                onChange={(e) => setDepositId(e.value)}
                                placeholder="Todos"
                                className="w-100"
                                showClear
                                filter
                                loading={loadingDeposits}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Tipo Depósito</label>
                            <Dropdown
                                value={type}
                                options={typeOptions}
                                onChange={(e) => setType(e.value)}
                                placeholder="Todos"
                                className="w-100"
                                showClear
                            />
                        </div>
                    </div>
                </AccordionTab>
            </Accordion>

            {/* Resumen general con valores monetarios */}
            <div className="row mt-4 mb-4">
                <div className="col-md-3 mb-3">
                    <Card className="h-100 shadow-sm">
                        <div className="text-center">
                            <h5 className="text-muted">Valor Total Entradas</h5>
                            <h3 className="text-success">
                                {formatCurrency(entriesTotalValue)}
                            </h3>
                            <small className="text-muted">
                                {entriesCount} movimientos
                            </small>
                        </div>
                    </Card>
                </div>
                <div className="col-md-3 mb-3">
                    <Card className="h-100 shadow-sm">
                        <div className="text-center">
                            <h5 className="text-muted">Valor Total Salidas</h5>
                            <h3 className="text-danger">
                                {formatCurrency(exitsTotalValue)}
                            </h3>
                            <small className="text-muted">
                                {exitsCount} movimientos
                            </small>
                        </div>
                    </Card>
                </div>
                <div className="col-md-3 mb-3">
                    <Card className="h-100 shadow-sm">
                        <div className="text-center">
                            <h5 className="text-muted">Valor Traslados</h5>
                            <h3 className="text-info">
                                {formatCurrency(transfersTotalValue)}
                            </h3>
                            <small className="text-muted">
                                {transfersCount} movimientos
                            </small>
                        </div>
                    </Card>
                </div>
                <div className="col-md-3 mb-3">
                    <Card className="h-100 shadow-sm">
                        <div className="text-center">
                            <h5 className="text-muted">Depósitos Activos</h5>
                            <h3 className="text-primary">
                                {reportData.filter((d) => d.is_active).length}
                            </h3>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Tabs */}
            <Card className="shadow-sm">
                <TabView
                    activeIndex={activeIndex}
                    onTabChange={(e) => setActiveIndex(e.index)}
                >
                    <TabPanel header="General">
                        <GeneralInventoryTable
                            reportData={reportData}
                            loading={loading}
                            expandedRows={expandedRows}
                            setExpandedRows={setExpandedRows}
                            footerTotales={footerTotales}
                        />
                    </TabPanel>
                    <TabPanel header="Entradas">
                        <EntriesTable deposits={entriesDeposits} loading={loading} />
                    </TabPanel>
                    <TabPanel header="Salidas">
                        <ExitsTable deposits={exitsDeposits} loading={loading} />
                    </TabPanel>
                    <TabPanel header="Traslados">
                        <TransfersTable
                            deposits={transfersDeposits}
                            loading={loading}
                        />
                    </TabPanel>
                </TabView>
            </Card>

            <InventoryTransferModal
                visible={showTransferModal}
                onHide={() => setShowTransferModal(false)}
                onSuccess={() => {
                    refreshReport({}); // Refresh report on success
                }}
            />
        </div>
    );
};
