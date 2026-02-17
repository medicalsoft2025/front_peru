import React from "react";
import ReactDOMClient from "react-dom/client";
import { LoginApp } from "./LoginApp.js";

// Debug inicial
console.log("BOOTSTRAP MODULE OK");

document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.getElementById("LoginApp");
    if (!rootElement) {
        console.warn("Elemento #LoginApp no encontrado");
        return;
    }

    // Renderiza el componente
    ReactDOMClient.createRoot(rootElement).render(
        React.createElement(LoginApp)
    );

    console.log("LoginApp renderizado de peruuuu");
});
