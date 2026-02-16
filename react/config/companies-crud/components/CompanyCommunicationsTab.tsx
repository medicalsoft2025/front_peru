import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { CompanyWhatsAppConnection } from './CompanyWhatsAppConnection';
import { WhatsAppStatus } from '../../company-configuration/types/consultorio';

interface CompanyCommunicationsTabProps {
    companyId?: number;
    // We can accept initial status if we had it, but component fetches it.
}

export const CompanyCommunicationsTab: React.FC<CompanyCommunicationsTabProps> = ({
    companyId
}) => {
    const [whatsAppStatus, setWhatsAppStatus] = useState<WhatsAppStatus>({ connected: false });

    return (
        <Card className="shadow-sm">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h5 className="fw-bold mb-4">Configuración de Comunicaciones</h5>
                        <p className="text-muted mb-4">
                            Configura la conexión de WhatsApp para enviar notificaciones a tus pacientes desde esta empresa.
                        </p>

                        <CompanyWhatsAppConnection
                            companyId={companyId}
                            onStatusChange={setWhatsAppStatus}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};
