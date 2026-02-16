import React from "react";
import { Breadcrumb } from "./Breadcrumb";
import { usePatient } from "../../patients/hooks/usePatient";

interface PatientBreadcrumbProps {
    patientId: string;
    items: {
        label: string;
        href?: string;
    }[];
    activeItem: string;
    patientItemIndex: number;
}

export const PatientBreadcrumb = (props: PatientBreadcrumbProps) => {
    const { items, activeItem, patientItemIndex, patientId } = props;

    const { patient } = usePatient(patientId);

    const patientItem = {
        label: patient?.full_name || "Cargando...",
        href: `verPaciente?${patientId}`
    }

    const finalItems = items.map((item, index) => {
        if (index === patientItemIndex) {
            return patientItem;
        }
        return item;
    });

    return (
        <Breadcrumb
            items={finalItems}
            activeItem={activeItem}
        />
    );
};