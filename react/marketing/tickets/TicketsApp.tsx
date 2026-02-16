
import React, { useState } from "react";
import { TicketsList } from "./TicketsList";
import { TicketForm } from "./TicketForm";
import { Card } from "primereact/card";

export const TicketsApp = () => {
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleNewTicket = () => {
        setIsFormVisible(true);
    };

    const handleSaveTicket = (data: any) => {
        console.log("Saving ticket:", data);
        setIsFormVisible(false);
        // Here you would typically call an API to save the ticket
    };

    return (
        <Card className="m-3">
            <TicketsList onNewTicket={handleNewTicket} />
            <TicketForm
                visible={isFormVisible}
                onHide={() => setIsFormVisible(false)}
                onSave={handleSaveTicket}
            />
        </Card>
    );
};
