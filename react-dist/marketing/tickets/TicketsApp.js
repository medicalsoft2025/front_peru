import React, { useState } from "react";
import { TicketsList } from "./TicketsList.js";
import { TicketForm } from "./TicketForm.js";
import { Card } from "primereact/card";
export const TicketsApp = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const handleNewTicket = () => {
    setIsFormVisible(true);
  };
  const handleSaveTicket = data => {
    console.log("Saving ticket:", data);
    setIsFormVisible(false);
    // Here you would typically call an API to save the ticket
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "m-3"
  }, /*#__PURE__*/React.createElement(TicketsList, {
    onNewTicket: handleNewTicket
  }), /*#__PURE__*/React.createElement(TicketForm, {
    visible: isFormVisible,
    onHide: () => setIsFormVisible(false),
    onSave: handleSaveTicket
  }));
};