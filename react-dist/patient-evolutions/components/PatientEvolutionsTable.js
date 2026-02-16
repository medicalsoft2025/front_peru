import React, { useState } from "react";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm.js";
import { tableFilters } from "../config/table-filters.js";
import { usePatientEvolutions } from "../hooks/usePatientEvolutions.js";
import { CustomPRTable } from "../../components/CustomPRTable.js";
import { formatDate } from "../../../services/utilidades.js";
export const PatientEvolutionsTable = props => {
  const {
    clinicalRecordId,
    initialFieldStates
  } = props;
  const patientId = new URLSearchParams(window.location.search).get("patientId") || new URLSearchParams(window.location.search).get("patient_id") || new URLSearchParams(window.location.search).get("id");
  if (!patientId) {
    return /*#__PURE__*/React.createElement("div", null, "No se encontro el id del paciente");
  }
  const [filters, setFilters] = useState({
    rangeDate: [new Date(), new Date()],
    user_id: null,
    clinicalRecordTypeId: null
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
  } = usePatientEvolutions({
    patientId,
    clinicalRecordId,
    filters
  });
  const columns = [{
    field: "date",
    header: "Fecha"
  }, {
    field: "doctor",
    header: "Doctor"
  }, {
    field: "clinicalRecordType",
    header: "Tipo de historia clínica"
  }, {
    field: "description",
    header: "Descripción"
  }];
  const tableItems = data?.map(evolution => ({
    id: evolution.id,
    date: formatDate(evolution.created_at),
    doctor: evolution.created_by_user.full_name,
    clinicalRecordType: evolution.clinical_record.name,
    description: evolution.note
  }));
  const handleFiltersChange = data => {
    setFilters(data);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(DynamicForm, {
    config: tableFilters,
    data: filters,
    onSubmit: () => {},
    onChange: handleFiltersChange,
    initialFieldStates: initialFieldStates
  }), /*#__PURE__*/React.createElement(CustomPRTable, {
    columns: columns,
    data: tableItems,
    lazy: true,
    first: first,
    rows: perPage,
    totalRecords: totalRecords,
    loading: isLoading || isFetching,
    onPage: handlePageChange,
    onSearch: handleSearchChange,
    onReload: refetch
  }));
};