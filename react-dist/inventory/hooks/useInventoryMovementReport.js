// hooks/useInventoryMovementReport.ts
import { useState, useEffect } from "react";
import { inventoryService } from "../../../services/api/index.js";
export const useInventoryMovementReport = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(null);
  useEffect(() => {
    fetchReportData();
  }, []);
  const fetchReportData = async (filters = {}) => {
    try {
      setLoading(true);
      // Pass filters to the service
      const response = await inventoryService.inventoryMovementReport(filters);
      const mappedResponse = response.map(deposit => {
        return {
          ...deposit,
          movements: deposit.movements.map(movement => {
            let finalRelatedDepositData = {
              relatedDeposit: movement.related_deposit,
              relatedDepositType: "related_deposit"
            };
            if (!finalRelatedDepositData.relatedDeposit) {
              finalRelatedDepositData = {
                relatedDeposit: movement.source_deposit,
                relatedDepositType: "source_deposit"
              };
            }
            if (!finalRelatedDepositData.relatedDeposit) {
              finalRelatedDepositData = {
                relatedDeposit: movement.destination_deposit,
                relatedDepositType: "destination_deposit"
              };
            }

            // Ensure product info is available if it exists in Lot but not directly in Movement (though backend handles this, good safety)
            let product = movement.product;
            if (!product && movement.lot && movement.lot.product) {
              product = movement.lot.product;
            }
            return {
              ...movement,
              product,
              // Explicitly set it
              related_deposit: finalRelatedDepositData.relatedDeposit,
              related_deposit_type: finalRelatedDepositData.relatedDepositType
            };
          })
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
    refreshReport: fetchReportData
  };
};