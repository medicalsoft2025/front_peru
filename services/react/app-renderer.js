import React from "react";
import ReactDOMClient from "react-dom/client";
import { AppWrapper } from "../../react-dist/wrappers/AppWrapper";

export const wrapWithProviders = (Component, props = {}) => {
    return React.createElement(AppWrapper, null,
        React.createElement(Component, props)
    );
};

export const renderApp = (Component, rootOrId, props = {}) => {
    const rootElement = typeof rootOrId === "string" ? document.getElementById(rootOrId) : rootOrId;
    if (!rootElement) {
        console.error(`Elemento ${typeof rootOrId === "string" ? `con id "${rootOrId}" ` : ""}no encontrado`);
        return;
    }
    
    const wrappedComponent = wrapWithProviders(Component, props);
    ReactDOMClient.createRoot(rootElement).render(wrappedComponent);
};