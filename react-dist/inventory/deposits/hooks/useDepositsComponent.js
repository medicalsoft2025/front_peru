import { useDeposits } from "./useDeposits.js";
import { useDepositSave } from "./useDepositSave.js";
export const useDepositsComponent = () => {
  const {
    deposits,
    refetch,
    loading: listLoading
  } = useDeposits();
  const {
    saveDeposit,
    selectedDeposit,
    setSelectedDeposit,
    loading: saveLoading,
    toast: saveToast
  } = useDepositSave();
  return {
    deposits,
    selectedDeposit,
    saveDeposit,
    fetchDeposits: refetch,
    setSelectedDeposit,
    saveLoading,
    listLoading,
    saveToast
  };
};