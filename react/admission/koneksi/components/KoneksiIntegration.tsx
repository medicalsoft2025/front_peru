import { Button } from "primereact/button";
import React from "react";
import { koneksiService } from "../services/KoneksiService";
import { appointmentToInitClaimProcessPayload } from "../mappers/appointmentToInitClaimProcessPayload";
import { useProductsToBeInvoiced } from "../../../appointments/hooks/useProductsToBeInvoiced";
import { useAppointment } from "../../../appointments/hooks/useAppointment";
import { useInitClaimProcess } from "../hooks/useInitClaimProcess";

interface KoneksiIntegrationProps {
    appointmentId: string;
}

export const KoneksiIntegration = ({ appointmentId }: KoneksiIntegrationProps) => {
    const { appointment } = useAppointment(appointmentId);
    const { products } = useProductsToBeInvoiced(appointmentId);

    const { initClaimProcess, loading, error, data } = useInitClaimProcess();

    const handleAuthorization = () => {
        const payload = appointmentToInitClaimProcessPayload(appointment, products);
        initClaimProcess(payload);
    }

    return (
        <div>
            <Button label="Autorizar con ARS" onClick={handleAuthorization} />
            {loading && <p>Cargando...</p>}
            {data && <p>Respuesta: {JSON.stringify(data)}</p>}
        </div>
    );
};