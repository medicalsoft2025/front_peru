import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Paginator } from 'primereact/paginator';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { useProductsByType } from "../../products/hooks/useProductsByType.js";
export const AvailabilitySlotsDialog = ({
  visible,
  onHide,
  availabilities,
  filtersUsed,
  onAddSelected,
  consultationPurposes = [],
  consultationTypes = [],
  externalCauses = [],
  onFetchAvailability,
  specialties = []
}) => {
  // Config State
  const [productId, setProductId] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [consultationPurpose, setConsultationPurpose] = useState(null);
  const [consultationType, setConsultationType] = useState(null);
  const [appointmentType, setAppointmentType] = useState("1");
  const [externalCause, setExternalCause] = useState(null);
  const [isValid, setIsValid] = useState(false);

  // Reactive Filter State (Left Panel)
  const [filterSpecialtyId, setFilterSpecialtyId] = useState(null);
  const [filterDateRange, setFilterDateRange] = useState(null);
  const [filterStartTime, setFilterStartTime] = useState(null);
  const [filterEndTime, setFilterEndTime] = useState(null);
  const [isReactiveMode, setIsReactiveMode] = useState(false);

  // Initial Filter Setup
  useEffect(() => {
    if (visible && filtersUsed) {
      // Determine mode
      const isIA = !!filtersUsed.instruction;
      setIsReactiveMode(isIA);

      // Populate filters
      if (filtersUsed.user_specialty_id) setFilterSpecialtyId(Number(filtersUsed.user_specialty_id));

      // Date Range
      const start = filtersUsed.start_date ? new Date(filtersUsed.start_date + 'T00:00:00') : null;
      const end = filtersUsed.end_date ? new Date(filtersUsed.end_date + 'T00:00:00') : null;
      if (start && end) setFilterDateRange([start, end]);

      // Time Range - Parse from filters
      if (filtersUsed.start_hour) {
        const d = new Date();
        d.setHours(Number(filtersUsed.start_hour), 0, 0, 0);
        setFilterStartTime(d);
      } else {
        setFilterStartTime(null);
      }
      if (filtersUsed.end_hour) {
        const d = new Date();
        d.setHours(Number(filtersUsed.end_hour), 0, 0, 0);
        setFilterEndTime(d);
      } else {
        setFilterEndTime(null);
      }

      // Appointment Type logic
      if (filtersUsed.appointment_type_id) {
        setAppointmentType(String(filtersUsed.appointment_type_id));
      } else {
        setAppointmentType("1");
      }
    }
  }, [visible, filtersUsed]);

  // Time Validation Handlers
  const handleStartTimeChange = date => {
    setFilterStartTime(date);
    if (date && filterEndTime && date > filterEndTime) {
      setFilterEndTime(date); // Ensure End >= Start
    }
  };
  const handleEndTimeChange = date => {
    setFilterEndTime(date);
    if (date && filterStartTime && date < filterStartTime) {
      setFilterStartTime(date); // Ensure Start <= End
    }
  };

  // Refetch Logic (Debounced or Triggered)
  const handleRefetch = () => {
    if (!onFetchAvailability) return;
    const filters = {
      ...filtersUsed
    };
    if (filterSpecialtyId) {
      filters.user_specialty_id = filterSpecialtyId;
      const spec = specialties.find(s => s.id === filterSpecialtyId);
      if (spec) filters.specialty_name = spec.name;
    }
    if (filterDateRange && filterDateRange[0]) {
      const start = filterDateRange[0];
      const end = filterDateRange[1] || start;
      filters.start_date = start.toISOString().split('T')[0];
      filters.end_date = end.toISOString().split('T')[0];
    }

    // Handle Time Range and prevent 'period' conflict
    if (filterStartTime || filterEndTime) {
      // If manual hours are set, remove generic period
      delete filters.period;
      if (filterStartTime) {
        filters.start_hour = filterStartTime.getHours();
      }
      if (filterEndTime) {
        filters.end_hour = filterEndTime.getHours();
      }
    }

    // Appointment Type
    filters.appointment_type_id = Number(appointmentType);
    onFetchAvailability(filters);
  };

  // Trigger refetch when Appointment Type changes (if Reactive Mode)
  useEffect(() => {
    if (visible && isReactiveMode && onFetchAvailability) {
      if (filtersUsed?.appointment_type_id != appointmentType) {
        handleRefetch();
      }
    }
  }, [appointmentType]);

  // Selection State
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Pagination State
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(12);

  // Products Hook
  const {
    productsByType: products,
    fetchProductsByType
  } = useProductsByType();
  useEffect(() => {
    fetchProductsByType('Servicios');
  }, []);

  // Validate Form
  useEffect(() => {
    const valid = !!(selectedProduct && consultationPurpose && consultationType && appointmentType && externalCause && selectedSlots.length > 0);
    setIsValid(valid);
  }, [selectedProduct, consultationPurpose, consultationType, appointmentType, externalCause, selectedSlots]);

  // Computed Slots with Past Time Filtering
  const allSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    availabilities.forEach(av => {
      av.days.forEach(day => {
        day.blocks.forEach(block => {
          const duration = av.appointment_duration || 15;
          const startDate = new Date(`${day.date}T${block.start_time}`);
          const endDate = new Date(`${day.date}T${block.end_time}`);
          let current = new Date(startDate);
          while (current < endDate) {
            // Filter if Past Time
            if (current > now) {
              const displayTime = current.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
              });
              // Format payload time as HH:mm
              const hours = String(current.getHours()).padStart(2, '0');
              const minutes = String(current.getMinutes()).padStart(2, '0');
              const payloadTime = `${hours}:${minutes}`;
              slots.push({
                date: day.date,
                time: payloadTime,
                // @ts-ignore
                displayTime: displayTime,
                user: av.user,
                branch: av.user.branch,
                appointmentType: av.appointment_type,
                duration: duration,
                availabilityId: av.availability_id
              });
            }
            current.setMinutes(current.getMinutes() + duration);
          }
        });
      });
    });
    return slots;
  }, [availabilities]);
  const visibleSlots = useMemo(() => {
    return allSlots.slice(first, first + rows);
  }, [allSlots, first, rows]);
  const handleSlotClick = slot => {
    const isSelected = selectedSlots.some(s => s.date === slot.date && s.time === slot.time && s.user.id === slot.user.id);
    if (isSelected) {
      setSelectedSlots(prev => prev.filter(s => !(s.date === slot.date && s.time === slot.time && s.user.id === slot.user.id)));
    } else {
      setSelectedSlots(prev => [...prev, slot]);
    }
  };
  const handleConfirm = () => {
    if (!isValid) return;
    onAddSelected(selectedSlots, {
      productId: selectedProduct?.id || productId,
      productName: selectedProduct?.name,
      consultationPurpose,
      consultationType: consultationType,
      appointmentType: appointmentType,
      externalCause
    });
    onHide();
  };

  // Filter Display Logic
  const displayFilters = useMemo(() => {
    if (!filtersUsed) return [];
    const list = [];
    if (filtersUsed.specialty_name) list.push({
      label: 'Especialidad',
      value: filtersUsed.specialty_name
    });
    if (filtersUsed.start_date) list.push({
      label: 'Fecha Inicio',
      value: filtersUsed.start_date
    });
    if (filtersUsed.end_date) list.push({
      label: 'Fecha Fin',
      value: filtersUsed.end_date
    });
    if (filtersUsed.instruction) list.push({
      label: 'IA Prompt',
      value: filtersUsed.instruction
    });

    // New Filters with Formatting
    if (filtersUsed.start_hour) {
      const h = Number(filtersUsed.start_hour);
      const label = h < 12 ? `${h} AM` : `${h === 12 ? 12 : h - 12} PM`;
      list.push({
        label: 'Hora Inicio',
        value: label
      });
    }
    if (filtersUsed.end_hour) {
      const h = Number(filtersUsed.end_hour);
      const label = h < 12 ? `${h} AM` : `${h === 12 ? 12 : h - 12} PM`;
      list.push({
        label: 'Hora Fin',
        value: label
      });
    }
    if (filtersUsed.period) list.push({
      label: 'Jornada',
      value: filtersUsed.period
    });
    if (filtersUsed.appointment_type_id) {
      const typeName = filtersUsed.appointment_type_id == 1 ? "Presencial" : filtersUsed.appointment_type_id == 2 ? "Virtual" : filtersUsed.appointment_type_id == 3 ? "Domiciliaria" : "Otro";
      list.push({
        label: 'Tipo de Cita',
        value: typeName
      });
    }
    return list;
  }, [filtersUsed]);
  const renderSlotItem = slot => {
    const isSelected = selectedSlots.some(s => s.date === slot.date && s.time === slot.time && s.user.id === slot.user.id);
    const timeLabel = slot.displayTime || slot.time;
    return /*#__PURE__*/React.createElement("div", {
      key: `${slot.date}-${slot.time}-${slot.user.id}`,
      className: "col-12 col-md-4 col-lg-3 p-2"
    }, /*#__PURE__*/React.createElement("div", {
      className: classNames('p-2 border rounded cursor-pointer transition-colors h-100 d-flex flex-column text-center position-relative', {
        'bg-primary text-white': isSelected,
        'bg-white text-dark': !isSelected,
        'border-primary': isSelected
      }),
      onClick: () => handleSlotClick(slot),
      style: {
        minHeight: '90px'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-check-circle position-absolute top-0 end-0 m-2 text-white",
      style: {
        display: isSelected ? 'block' : 'none'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "mb-1"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fw-bold fs-6"
    }, timeLabel)), /*#__PURE__*/React.createElement("div", {
      className: "small opacity-75 mb-1",
      style: {
        fontSize: '0.8rem'
      }
    }, "General"), /*#__PURE__*/React.createElement("div", {
      className: "mt-auto d-flex justify-content-center small opacity-75",
      style: {
        fontSize: '0.75rem'
      }
    }, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-map-marker-alt me-1"
    }), slot.branch?.name || slot.user.city_id)));
  };

  // Reset state on close
  useEffect(() => {
    if (!visible) {
      setSelectedSlots([]);
      setProductId(null);
      setSelectedProduct(null);
      setConsultationPurpose(null);
      setConsultationType(null);
      setExternalCause(null);
      setAppointmentType("1");
    }
  }, [visible]);
  return /*#__PURE__*/React.createElement(Dialog, {
    header: /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", {
      className: "fas fa-calendar-alt me-2"
    }), "Horarios Disponibles"),
    visible: visible,
    style: {
      width: '95vw',
      maxWidth: '1300px',
      height: '90vh'
    },
    onHide: onHide,
    className: "p-0",
    footer: /*#__PURE__*/React.createElement("div", {
      className: "d-flex justify-content-between align-items-center"
    }, /*#__PURE__*/React.createElement("span", {
      className: "fw-bold text-primary"
    }, selectedSlots.length, " horarios seleccionados"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
      label: "Cancelar",
      severity: "secondary",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-times me-1"
      }),
      onClick: onHide,
      className: "me-2",
      type: "button"
    }), /*#__PURE__*/React.createElement(Button, {
      label: "Agregar Seleccionados",
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-check me-1"
      }),
      onClick: handleConfirm,
      disabled: !isValid,
      type: "button"
    })))
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex h-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-end bg-light",
    style: {
      width: '320px',
      minWidth: '320px',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("h6", {
    className: "fw-bold mb-3 text-secondary"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-sliders-h me-2"
  }), "CONFIGURACI\xD3N"), displayFilters.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mb-4 p-3 bg-white rounded border border-primary border-opacity-25"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "text-primary small fw-bold mb-2"
  }, "Filtros Activos:"), /*#__PURE__*/React.createElement("ul", {
    className: "list-unstyled mb-0 small text-muted"
  }, displayFilters.map((f, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "mb-1 text-break"
  }, /*#__PURE__*/React.createElement("strong", null, f.label, ":"), " ", String(f.value))))), isReactiveMode && onFetchAvailability && /*#__PURE__*/React.createElement("div", {
    className: "mb-4 pb-3 border-bottom"
  }, /*#__PURE__*/React.createElement("h6", {
    className: "text-secondary small fw-bold mb-2"
  }, "AJUSTAR B\xDASQUEDA"), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Especialidad"), /*#__PURE__*/React.createElement(Dropdown, {
    value: filterSpecialtyId,
    options: specialties,
    optionLabel: "name",
    optionValue: "id",
    onChange: e => setFilterSpecialtyId(e.value),
    placeholder: "Todas",
    className: "w-100",
    showClear: true,
    filter: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Rango Fechas"), /*#__PURE__*/React.createElement(Calendar, {
    value: filterDateRange,
    onChange: e => setFilterDateRange(e.value),
    selectionMode: "range",
    readOnlyInput: true,
    dateFormat: "yy-mm-dd",
    className: "w-100",
    placeholder: "Seleccionar rango"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Rango Horas"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-1"
  }, /*#__PURE__*/React.createElement(Calendar, {
    value: filterStartTime,
    onChange: e => handleStartTimeChange(e.value),
    timeOnly: true,
    placeholder: "Inicio",
    className: "w-50",
    showIcon: false
  }), /*#__PURE__*/React.createElement(Calendar, {
    value: filterEndTime,
    onChange: e => handleEndTimeChange(e.value),
    timeOnly: true,
    placeholder: "Fin",
    className: "w-50",
    showIcon: false
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small text-muted"
  }, "Tipo de Cita"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "type1a",
    value: "1",
    name: "appointmentTypeR",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === '1'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "type1a",
    className: "ms-1 small cursor-pointer"
  }, "Presencial")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "type2a",
    value: "2",
    name: "appointmentTypeR",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === '2'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "type2a",
    className: "ms-1 small cursor-pointer"
  }, "Virtual")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "type3a",
    value: "3",
    name: "appointmentTypeR",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === '3'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "type3a",
    className: "ms-1 small cursor-pointer"
  }, "Domiciliaria")))), /*#__PURE__*/React.createElement(Button, {
    label: "Actualizar B\xFAsqueda",
    icon: "pi pi-refresh",
    className: "p-button-sm p-button-outlined w-100 mt-2",
    onClick: handleRefetch
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold text-muted"
  }, "SERVICIO *"), /*#__PURE__*/React.createElement(Dropdown, {
    value: selectedProduct,
    options: products,
    optionLabel: "label",
    onChange: e => setSelectedProduct(e.value),
    placeholder: "Seleccione...",
    className: classNames("w-100 dropdown-appointment", {
      "p-invalid": !selectedProduct
    }),
    filter: true,
    showClear: true
  })), !isReactiveMode && !filtersUsed?.appointment_type_id && /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold text-muted"
  }, "TIPO DE CITA *"), /*#__PURE__*/React.createElement("div", {
    className: "d-flex gap-2 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "type1",
    value: "1",
    name: "appointmentType",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === '1'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "type1",
    className: "ms-1 small cursor-pointer"
  }, "Presencial")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "type2",
    value: "2",
    name: "appointmentType",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === '2'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "type2",
    className: "ms-1 small cursor-pointer"
  }, "Virtual")), /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center"
  }, /*#__PURE__*/React.createElement(RadioButton, {
    inputId: "type3",
    value: "3",
    name: "appointmentType",
    onChange: e => setAppointmentType(e.value),
    checked: appointmentType === '3'
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "type3",
    className: "ms-1 small cursor-pointer"
  }, "Domiciliaria")))), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold text-muted"
  }, "TIPO DE CONSULTA *"), /*#__PURE__*/React.createElement(Dropdown, {
    value: consultationType,
    options: consultationTypes || [],
    optionLabel: "label",
    optionValue: "value",
    onChange: e => setConsultationType(e.value),
    placeholder: "Seleccione...",
    className: classNames("w-100", {
      "p-invalid": !consultationType
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold text-muted"
  }, "FINALIDAD *"), /*#__PURE__*/React.createElement(Dropdown, {
    value: consultationPurpose,
    options: consultationPurposes || [],
    optionLabel: "label",
    optionValue: "value",
    onChange: e => setConsultationPurpose(e.value),
    placeholder: "Seleccione...",
    className: classNames("w-100", {
      "p-invalid": !consultationPurpose
    })
  })), /*#__PURE__*/React.createElement("div", {
    className: "mb-3"
  }, /*#__PURE__*/React.createElement("label", {
    className: "form-label small fw-bold text-muted"
  }, "CAUSA EXTERNA *"), /*#__PURE__*/React.createElement(Dropdown, {
    value: externalCause,
    options: externalCauses || [],
    optionLabel: "label",
    optionValue: "value",
    onChange: e => setExternalCause(e.value),
    placeholder: "Seleccione...",
    className: classNames("w-100", {
      "p-invalid": !externalCause
    })
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1 p-4 d-flex flex-column h-100",
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-100 d-flex flex-column"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex align-items-center mb-3 pb-2 border-bottom flex-shrink-0"
  }, /*#__PURE__*/React.createElement("h5", {
    className: "text-primary mb-0 fw-bold"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-list-ul me-2"
  }), "Resultados (", allSlots.length, ")")), allSlots.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1 d-flex flex-column justify-content-center align-items-center text-muted opacity-50"
  }, /*#__PURE__*/React.createElement("i", {
    className: "fas fa-calendar-times fa-3x mb-3"
  }), /*#__PURE__*/React.createElement("p", null, "No hay horarios disponibles.")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex-grow-1 overflow-auto pe-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row g-2"
  }, visibleSlots.map(renderSlotItem))), /*#__PURE__*/React.createElement("div", {
    className: "flex-shrink-0 mt-3 pt-2 border-top"
  }, /*#__PURE__*/React.createElement(Paginator, {
    first: first,
    rows: rows,
    totalRecords: allSlots.length,
    onPageChange: e => {
      setFirst(e.first);
      setRows(e.rows);
    }
  })))))));
};