import React, { useState } from "react";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm";
import { tableFilters } from "../config/table-filters";
import { usePatientEvolutions } from "../hooks/usePatientEvolutions";
import { CustomPRTable, CustomPRTableColumnProps } from "../../components/CustomPRTable";
import { EvolutionNotesFilters } from "../interfaces/types";
import { FieldState } from "../../dynamic-form/interfaces/models";
import { formatDate } from "../../../services/utilidades";

interface PatientEvolutionsTableProps {
    clinicalRecordId?: string;
    initialFieldStates?: Record<string, FieldState>;
}

export const PatientEvolutionsTable = (props: PatientEvolutionsTableProps) => {

    const { clinicalRecordId, initialFieldStates } = props

    const patientId =
        new URLSearchParams(window.location.search).get("patientId") ||
        new URLSearchParams(window.location.search).get("patient_id") ||
        new URLSearchParams(window.location.search).get("id");

    if (!patientId) {
        return <div>No se encontro el id del paciente</div>
    }

    const [filters, setFilters] = useState<EvolutionNotesFilters>({
        rangeDate: [new Date(), new Date()],
        user_id: null,
        clinicalRecordTypeId: null,
    });

    const {
        data,
        isLoading,
        isFetching,
        refetch,
        handlePageChange,
        handleSearchChange,
        totalRecords,
        first,
        perPage
    } = usePatientEvolutions({ patientId, clinicalRecordId, filters })

    const columns: CustomPRTableColumnProps[] = [
        { field: "date", header: "Fecha" },
        { field: "doctor", header: "Doctor" },
        { field: "clinicalRecordType", header: "Tipo de historia clínica" },
        { field: "description", header: "Descripción" },
    ];

    const tableItems = data?.map((evolution: any) => ({
        id: evolution.id,
        date: formatDate(evolution.created_at),
        doctor: evolution.created_by_user.full_name,
        clinicalRecordType: evolution.clinical_record.name,
        description: evolution.note,
    }));

    const handleFiltersChange = (data: any) => {
        setFilters(data);
    }

    return (<>
        <DynamicForm
            config={tableFilters}
            data={filters}
            onSubmit={() => { }}
            onChange={handleFiltersChange}
            initialFieldStates={initialFieldStates}
        />
        <CustomPRTable
            columns={columns}
            data={tableItems}
            lazy
            first={first}
            rows={perPage}
            totalRecords={totalRecords}
            loading={isLoading || isFetching}
            onPage={handlePageChange}
            onSearch={handleSearchChange}
            onReload={refetch}
        />
    </>)
}