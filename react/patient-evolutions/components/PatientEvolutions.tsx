import React from "react";
import { PersistentQueryProvider } from "../../wrappers/PersistentQueryProvider";
import { PatientEvolutionsTable } from "./PatientEvolutionsTable";

export const PatientEvolutions = () => {
    return (
        <PersistentQueryProvider>
            <PatientEvolutionsTable />
        </PersistentQueryProvider>
    );
};