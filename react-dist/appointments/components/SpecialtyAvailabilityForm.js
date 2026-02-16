import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { useQuery } from '@tanstack/react-query';
import { userAvailabilityService, appointmentTypeService, userSpecialtyService } from "../../../services/api/index.js";
export const SpecialtyAvailabilityForm = ({
  onAvailabilityFound,
  onLoading
}) => {
  const [specialtyId, setSpecialtyId] = useState(null);
  const [date, setDate] = useState(new Date());
  const [appointmentTypeId, setAppointmentTypeId] = useState(1); // Default Presencial

  // Fetch Specialties
  const {
    data: specialties
  } = useQuery({
    queryKey: ['user-specialties'],
    queryFn: () => userSpecialtyService.getAll().then(res => res.data || res),
    staleTime: 1000 * 60 * 60
  });

  // Fetch Appointment Types
  const {
    data: appointmentTypes
  } = useQuery({
    queryKey: ['appointmentTypes'],
    queryFn: () => appointmentTypeService.getAll().then(res => res.data || res),
    staleTime: 1000 * 60 * 60
  });
  const handleSearch = async () => {
    if (!specialtyId || !date || !appointmentTypeId) return;
    onLoading(true);
    try {
      // Fix timezone issue by using local date components
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      const selectedSpecialty = specialties?.find(s => s.id === specialtyId);
      const filters = {
        user_specialty_id: specialtyId,
        specialty_name: selectedSpecialty?.name,
        // Pass name for display
        start_date: dateStr,
        end_date: dateStr,
        appointment_type_id: appointmentTypeId
      };
      const response = await userAvailabilityService.availableBlocks(filters);
      // Assuming response is the array or response.data
      const data = Array.isArray(response) ? response : response.data || [];
      onAvailabilityFound(data, filters);
    } catch (error) {
      console.error("Error fetching availability", error);
    } finally {
      onLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "p-4 border rounded bg-light"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Especialidad"), /*#__PURE__*/React.createElement(Dropdown, {
    value: specialtyId,
    options: specialties || [],
    optionLabel: "name",
    optionValue: "id",
    onChange: e => setSpecialtyId(e.value),
    placeholder: "Seleccione...",
    className: "w-100",
    filter: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-md-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold"
  }, "Fecha"), /*#__PURE__*/React.createElement(Calendar, {
    value: date,
    onChange: e => setDate(e.value),
    showIcon: true,
    dateFormat: "yy-mm-dd",
    className: "w-100",
    minDate: new Date() // Prevent past dates
  })), /*#__PURE__*/React.createElement("div", {
    className: "col-12"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold d-block"
  }, "Tipo de Cita"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-4"
  }, appointmentTypes?.map(type => /*#__PURE__*/React.createElement("div", {
    key: type.id,
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: `type-${type.id}`,
    name: "appointmentType",
    value: type.id,
    onChange: e => setAppointmentTypeId(e.value),
    checked: appointmentTypeId === type.id
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: `type-${type.id}`,
    className: "ms-2 small cursor-pointer"
  }, type.name))), !appointmentTypes && /*#__PURE__*/React.createElement("small", {
    className: "text-muted"
  }, "Cargando tipos..."))), /*#__PURE__*/React.createElement("div", {
    className: "col-12 d-flex justify-content-end mt-3"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: "Buscar Espacios",
    icon: "pi pi-search",
    onClick: handleSearch,
    disabled: !specialtyId || !date
  }))));
};