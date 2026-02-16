import { Deposito } from "../ts/depositsType";
import { depositService } from "../../../../services/api";
import { useState } from "react";
import { useDeposits } from "./useDeposits";
import { usePRToast } from "../../../hooks/usePRToast";

export const useDepositSave = () => {
    const [selectedDeposit, setSelectedDeposit] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast()
    const { refetch } = useDeposits()

    const saveDeposit = async (formData: Partial<Deposito>) => {
        try {
            if (selectedDeposit?.id) {
                await depositService.update(selectedDeposit?.id, formData);
                showSuccessToast({
                    title: "Deposito actualizado",
                    message: "Deposito actualizado correctamente",
                });
            } else {
                await depositService.create(formData);
                showSuccessToast({
                    title: "Deposito creado",
                    message: "Deposito creado correctamente",
                });
            }
            await refetch();
        } catch (error) {
            console.error("Error creating/updating deposit: ", error);
            showServerErrorsToast(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        saveDeposit,
        selectedDeposit,
        setSelectedDeposit,
        loading,
        toast
    };
}