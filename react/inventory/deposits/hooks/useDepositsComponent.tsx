import { useDeposits } from "./useDeposits";
import { useDepositSave } from "./useDepositSave";

export const useDepositsComponent = () => {
    const { deposits, refetch, loading: listLoading } = useDeposits()
    const { saveDeposit, selectedDeposit, setSelectedDeposit, loading: saveLoading, toast: saveToast } = useDepositSave()

    return {
        deposits,
        selectedDeposit,
        saveDeposit,
        fetchDeposits: refetch,
        setSelectedDeposit,
        saveLoading,
        listLoading,
        saveToast
    }
}