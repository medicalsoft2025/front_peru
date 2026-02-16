import React, { createContext, useContext } from "react";

export const PlanEstudioContext = createContext(undefined);

export const usePlanEstudioContext = () => {
    const context = useContext(PlanEstudioContext);
    if (!context) {
        throw new Error("usePlanEstudioContext must be used within PlanEstudioProvider");
    }
    return context;
};
