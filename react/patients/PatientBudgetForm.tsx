import React from "react";
import { FormPurchaseOrders } from "../invoices/form/FormPurchaseOrdersV2";
import { usePatientThirdParty } from "./hooks/usePatientThirdParty";

export const PatientBudgetForm = ({ patientId }: { patientId: string }) => {

    const { patientThirdParty, isLoading } = usePatientThirdParty(patientId)

    if (isLoading) {
        return <div>Cargando...</div>
    }

    return (
        <div>
            <FormPurchaseOrders
                dataToEdit={{
                    third_party_id: patientThirdParty?.id,
                    type: "quote_of"
                }}
                fieldsConfig={{
                    supplier: {
                        disabled: true
                    },
                    type: {
                        disabled: true
                    }
                }}
                title={`Crear Cotización | ${patientThirdParty?.name}`}
            />
        </div>
    )
}