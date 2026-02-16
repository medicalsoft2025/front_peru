
import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";

interface Ticket {
    id: number;
    subject: string;
    frequency: string;
    status: string;
    created_at: string;
}

interface TicketsListProps {
    onNewTicket: () => void;
}

export const TicketsList: React.FC<TicketsListProps> = ({ onNewTicket }) => {
    // Mock data
    const [tickets, setTickets] = useState<Ticket[]>([
        { id: 1, subject: "Error en login", frequency: "Siempre", status: "Abierto", created_at: "2023-10-27" },
        { id: 2, subject: "Pantalla blanca en reportes", frequency: "A veces", status: "En Proceso", created_at: "2023-10-26" },
    ]);

    const statusBodyTemplate = (rowData: Ticket) => {
        return <span className={`badge ${rowData.status === 'Abierto' ? 'bg-danger' : 'bg-success'}`}>{rowData.status}</span>;
    };

    const actionBodyTemplate = (rowData: Ticket) => {
        return (
            <Button icon="pi pi-search" className="p-button-rounded p-button-text" aria-label="Ver" />
        );
    }

    return (
        <div className="card">
            <div className="flex justify-content-between mb-3">
                <h3>Listado de Tickets</h3>
                <Button label="Crear Ticket" icon="pi pi-plus" className="p-button-success" onClick={onNewTicket} />
            </div>
            
            <DataTable value={tickets} paginator rows={10} emptyMessage="No hay tickets encontrados.">
                <Column field="id" header="ID" sortable></Column>
                <Column field="subject" header="Asunto" sortable></Column>
                <Column field="frequency" header="Frecuencia" sortable></Column>
                <Column field="created_at" header="Fecha Creación" sortable></Column>
                <Column field="status" header="Estado" body={statusBodyTemplate} sortable></Column>
                <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
            </DataTable>
        </div>
    );
};
