// hooks/useInventoryMovementReport.ts
import { useState, useEffect } from "react";
import { inventoryService } from "../../../services/api";


export interface Product {
    id: number;
    name: string;
    code: string;
}

export interface Branch {
    id: number;
    name: string;
}

export interface Company {
    id: number;
    name: string;
}

export interface Movement {
    movement_id: number;
    type: string;
    quantity: number;
    unit_price: number;
    tax_amount: number;
    total_value: number;
    total_tax: number;
    total_with_tax: number;
    movement_date: string;
    notes: string;
    created_at: string;
    updated_at: string;
    product?: Product;
    lot?: Lot;
    invoice?: Invoice;
    user?: User;
    branch?: Branch;
    company?: Company;
    source_deposit?: Deposit;
    destination_deposit?: Deposit;
    related_deposit?: Deposit;
    related_deposit_type?: string;
}

export interface Lot {
    id: number
    lot_number: string
    product?: Product
}

export interface Invoice {
    id: number
    invoice_code: string
}

export interface User {
    id: number
    full_name: string
}

export interface Deposit {
    id: number
    name: string
    type: string
}

interface DepositReport {
    deposit_id: number;
    deposit_name: string;
    deposit_type: string;
    is_active: boolean;
    total_movements: number;
    movements: Movement[];
}

export const useInventoryMovementReport = () => {
    const [reportData, setReportData] = useState<DepositReport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async (filters: any = {}) => {
        try {
            setLoading(true);
            // Pass filters to the service
            const response = await inventoryService.inventoryMovementReport(filters);
            const mappedResponse = response.map((deposit: DepositReport) => {
                return {
                    ...deposit,
                    movements: deposit.movements.map((movement: Movement) => {

                        let finalRelatedDepositData = {
                            relatedDeposit: movement.related_deposit,
                            relatedDepositType: "related_deposit"
                        }

                        if (!finalRelatedDepositData.relatedDeposit) {
                            finalRelatedDepositData = {
                                relatedDeposit: movement.source_deposit,
                                relatedDepositType: "source_deposit"
                            }
                        }

                        if (!finalRelatedDepositData.relatedDeposit) {
                            finalRelatedDepositData = {
                                relatedDeposit: movement.destination_deposit,
                                relatedDepositType: "destination_deposit"
                            }
                        }

                        // Ensure product info is available if it exists in Lot but not directly in Movement (though backend handles this, good safety)
                        let product = movement.product;
                        if (!product && movement.lot && movement.lot.product) {
                            product = movement.lot.product;
                        }

                        return {
                            ...movement,
                            product, // Explicitly set it
                            related_deposit: finalRelatedDepositData.relatedDeposit,
                            related_deposit_type: finalRelatedDepositData.relatedDepositType,

                        };
                    }),
                };
            });
            setReportData(mappedResponse);
        } catch (error) {
            console.error("Error fetching inventory movement report:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        reportData,
        loading,
        dateRange,
        setDateRange,
        refreshReport: fetchReportData,
    };
};
