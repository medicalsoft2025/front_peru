import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { RadioButton } from 'primereact/radiobutton';
import { Paginator } from 'primereact/paginator';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { AvailabilityData, SelectedSlot, AppointmentConfig } from './types';
import { useProductsByType } from '../../products/hooks/useProductsByType';

interface OptionItem {
    label: string;
    value: any;
}

interface AvailabilitySlotsDialogProps {
    visible: boolean;
    onHide: () => void;
    availabilities: AvailabilityData[];
    filtersUsed?: any;
    onAddSelected: (slots: SelectedSlot[], config: AppointmentConfig) => void;
    consultationPurposes?: OptionItem[];
    consultationTypes?: OptionItem[];
    externalCauses?: OptionItem[];
    onFetchAvailability?: (filters: any) => void;
    specialties?: any[];
}

export const AvailabilitySlotsDialog: React.FC<AvailabilitySlotsDialogProps> = ({
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
    const [productId, setProductId] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [consultationPurpose, setConsultationPurpose] = useState<string | null>(null);
    const [consultationType, setConsultationType] = useState<string | null>(null);
    const [appointmentType, setAppointmentType] = useState<string | null>("1");
    const [externalCause, setExternalCause] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    // Reactive Filter State (Left Panel)
    const [filterSpecialtyId, setFilterSpecialtyId] = useState<number | null>(null);
    const [filterDateRange, setFilterDateRange] = useState<Date[] | null>(null);
    const [filterStartTime, setFilterStartTime] = useState<Date | null>(null);
    const [filterEndTime, setFilterEndTime] = useState<Date | null>(null);
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
    const handleStartTimeChange = (date: Date | null) => {
        setFilterStartTime(date);
        if (date && filterEndTime && date > filterEndTime) {
            setFilterEndTime(date); // Ensure End >= Start
        }
    };

    const handleEndTimeChange = (date: Date | null) => {
        setFilterEndTime(date);
        if (date && filterStartTime && date < filterStartTime) {
            setFilterStartTime(date); // Ensure Start <= End
        }
    };

    // Refetch Logic (Debounced or Triggered)
    const handleRefetch = () => {
        if (!onFetchAvailability) return;

        const filters: any = { ...filtersUsed };

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
    const [selectedSlots, setSelectedSlots] = useState<SelectedSlot[]>([]);

    // Pagination State
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(12);

    // Products Hook
    const { productsByType: products, fetchProductsByType } = useProductsByType();

    useEffect(() => {
        fetchProductsByType('Servicios');
    }, []);

    // Validate Form
    useEffect(() => {
        const valid = !!(
            selectedProduct &&
            consultationPurpose &&
            consultationType &&
            appointmentType &&
            externalCause &&
            selectedSlots.length > 0
        );
        setIsValid(valid);
    }, [selectedProduct, consultationPurpose, consultationType, appointmentType, externalCause, selectedSlots]);

    // Computed Slots with Past Time Filtering
    const allSlots = useMemo(() => {
        const slots: SelectedSlot[] = [];
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
                            const displayTime = current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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

    const handleSlotClick = (slot: SelectedSlot) => {
        const isSelected = selectedSlots.some(s =>
            s.date === slot.date &&
            s.time === slot.time &&
            s.user.id === slot.user.id
        );

        if (isSelected) {
            setSelectedSlots(prev => prev.filter(s =>
                !(s.date === slot.date && s.time === slot.time && s.user.id === slot.user.id)
            ));
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
        } as any);
        onHide();
    };

    // Filter Display Logic
    const displayFilters = useMemo(() => {
        if (!filtersUsed) return [];
        const list = [];
        if (filtersUsed.specialty_name) list.push({ label: 'Especialidad', value: filtersUsed.specialty_name });
        if (filtersUsed.start_date) list.push({ label: 'Fecha Inicio', value: filtersUsed.start_date });
        if (filtersUsed.end_date) list.push({ label: 'Fecha Fin', value: filtersUsed.end_date });
        if (filtersUsed.instruction) list.push({ label: 'IA Prompt', value: filtersUsed.instruction });

        // New Filters with Formatting
        if (filtersUsed.start_hour) {
            const h = Number(filtersUsed.start_hour);
            const label = h < 12 ? `${h} AM` : `${h === 12 ? 12 : h - 12} PM`;
            list.push({ label: 'Hora Inicio', value: label });
        }
        if (filtersUsed.end_hour) {
            const h = Number(filtersUsed.end_hour);
            const label = h < 12 ? `${h} AM` : `${h === 12 ? 12 : h - 12} PM`;
            list.push({ label: 'Hora Fin', value: label });
        }
        if (filtersUsed.period) list.push({ label: 'Jornada', value: filtersUsed.period });

        if (filtersUsed.appointment_type_id) {
            const typeName = filtersUsed.appointment_type_id == 1 ? "Presencial" : filtersUsed.appointment_type_id == 2 ? "Virtual" : filtersUsed.appointment_type_id == 3 ? "Domiciliaria" : "Otro";
            list.push({ label: 'Tipo de Cita', value: typeName });
        }

        return list;
    }, [filtersUsed]);

    const renderSlotItem = (slot: SelectedSlot | any) => {
        const isSelected = selectedSlots.some(s =>
            s.date === slot.date &&
            s.time === slot.time &&
            s.user.id === slot.user.id
        );
        const timeLabel = slot.displayTime || slot.time;

        return (
            <div key={`${slot.date}-${slot.time}-${slot.user.id}`} className="col-12 col-md-4 col-lg-3 p-2">
                <div
                    className={classNames('p-2 border rounded cursor-pointer transition-colors h-100 d-flex flex-column text-center position-relative', {
                        'bg-primary text-white': isSelected,
                        'bg-white text-dark': !isSelected,
                        'border-primary': isSelected
                    })}
                    onClick={() => handleSlotClick(slot)}
                    style={{ minHeight: '90px' }}
                >
                    <i className="fas fa-check-circle position-absolute top-0 end-0 m-2 text-white" style={{ display: isSelected ? 'block' : 'none' }}></i>

                    <div className="mb-1">
                        <span className="fw-bold fs-6">{timeLabel}</span>
                    </div>

                    <div className="small opacity-75 mb-1" style={{ fontSize: '0.8rem' }}>
                        General
                    </div>

                    <div className="mt-auto d-flex justify-content-center small opacity-75" style={{ fontSize: '0.75rem' }}>
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {slot.branch?.name || slot.user.city_id}
                    </div>
                </div>
            </div>
        );
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

    return (
        <Dialog
            header={
                <div>
                    <i className="fas fa-calendar-alt me-2"></i>
                    Horarios Disponibles
                </div>
            }
            visible={visible}
            style={{ width: '95vw', maxWidth: '1300px', height: '90vh' }}
            onHide={onHide}
            className="p-0"
            footer={
                <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">
                        {selectedSlots.length} horarios seleccionados
                    </span>
                    <div>
                        <Button label="Cancelar" severity='secondary' icon={<i className='fa fa-times me-1' />} onClick={onHide} className="me-2" type="button" />
                        <Button
                            label="Agregar Seleccionados"
                            icon={<i className='fa fa-check me-1' />}
                            onClick={handleConfirm}
                            disabled={!isValid}
                            type="button"
                        />
                    </div>
                </div>
            }
        >
            <div className="d-flex h-100">
                {/* Left Config Panel */}
                <div className="p-4 border-end bg-light" style={{ width: '320px', minWidth: '320px', overflowY: 'auto' }}>
                    <h6 className="fw-bold mb-3 text-secondary">
                        <i className="fas fa-sliders-h me-2"></i>
                        CONFIGURACIÓN
                    </h6>

                    {/* Filters Used Info */}
                    {displayFilters.length > 0 && (
                        <div className="mb-4 p-3 bg-white rounded border border-primary border-opacity-25">
                            <h6 className="text-primary small fw-bold mb-2">Filtros Activos:</h6>
                            <ul className="list-unstyled mb-0 small text-muted">
                                {displayFilters.map((f, i) => (
                                    <li key={i} className="mb-1 text-break">
                                        <strong>{f.label}:</strong> {String(f.value)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Reactive Filters for AI Mode */}
                    {isReactiveMode && onFetchAvailability && (
                        <div className="mb-4 pb-3 border-bottom">
                            <h6 className="text-secondary small fw-bold mb-2">AJUSTAR BÚSQUEDA</h6>

                            <div className="mb-2">
                                <label className="form-label small text-muted">Especialidad</label>
                                <Dropdown
                                    value={filterSpecialtyId}
                                    options={specialties}
                                    optionLabel="name"
                                    optionValue="id"
                                    onChange={(e) => setFilterSpecialtyId(e.value)}
                                    placeholder="Todas"
                                    className="w-100"
                                    showClear
                                    filter
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label small text-muted">Rango Fechas</label>
                                <Calendar
                                    value={filterDateRange}
                                    onChange={(e) => setFilterDateRange(e.value as Date[])}
                                    selectionMode="range"
                                    readOnlyInput
                                    dateFormat="yy-mm-dd"
                                    className="w-100"
                                    placeholder="Seleccionar rango"
                                />
                            </div>

                            <div className="mb-2">
                                <label className="form-label small text-muted">Rango Horas</label>
                                <div className="d-flex gap-1">
                                    <Calendar
                                        value={filterStartTime}
                                        onChange={(e) => handleStartTimeChange(e.value as Date)}
                                        timeOnly
                                        placeholder="Inicio"
                                        className="w-50"
                                        showIcon={false}
                                    />
                                    <Calendar
                                        value={filterEndTime}
                                        onChange={(e) => handleEndTimeChange(e.value as Date)}
                                        timeOnly
                                        placeholder="Fin"
                                        className="w-50"
                                        showIcon={false}
                                    />
                                </div>
                            </div>

                            {/* Appointment Type (Reactive context) */}
                            <div className="mb-2">
                                <label className="form-label small text-muted">Tipo de Cita</label>
                                <div className="d-flex gap-2 flex-wrap">
                                    <div className="d-flex align-items-center">
                                        <RadioButton inputId="type1a" value="1" name="appointmentTypeR" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === '1'} />
                                        <label htmlFor="type1a" className="ms-1 small cursor-pointer">Presencial</label>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <RadioButton inputId="type2a" value="2" name="appointmentTypeR" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === '2'} />
                                        <label htmlFor="type2a" className="ms-1 small cursor-pointer">Virtual</label>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <RadioButton inputId="type3a" value="3" name="appointmentTypeR" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === '3'} />
                                        <label htmlFor="type3a" className="ms-1 small cursor-pointer">Domiciliaria</label>
                                    </div>
                                </div>
                            </div>

                            <Button
                                label="Actualizar Búsqueda"
                                icon="pi pi-refresh"
                                className="p-button-sm p-button-outlined w-100 mt-2"
                                onClick={handleRefetch}
                            />
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">SERVICIO *</label>
                        <Dropdown
                            value={selectedProduct}
                            options={products}
                            optionLabel="label"
                            onChange={(e) => setSelectedProduct(e.value)}
                            placeholder="Seleccione..."
                            className={classNames("w-100 dropdown-appointment", { "p-invalid": !selectedProduct })}
                            filter
                            showClear
                        />
                    </div>

                    {/* Show Appointment Type here ONLY if NOT Reactive Mode and NOT pre-filtered */}
                    {(!isReactiveMode && !filtersUsed?.appointment_type_id) && (
                        <div className="mb-3">
                            <label className="form-label small fw-bold text-muted">TIPO DE CITA *</label>
                            <div className="d-flex gap-2 flex-wrap">
                                <div className="d-flex align-items-center">
                                    <RadioButton inputId="type1" value="1" name="appointmentType" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === '1'} />
                                    <label htmlFor="type1" className="ms-1 small cursor-pointer">Presencial</label>
                                </div>
                                <div className="d-flex align-items-center">
                                    <RadioButton inputId="type2" value="2" name="appointmentType" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === '2'} />
                                    <label htmlFor="type2" className="ms-1 small cursor-pointer">Virtual</label>
                                </div>
                                <div className="d-flex align-items-center">
                                    <RadioButton inputId="type3" value="3" name="appointmentType" onChange={(e) => setAppointmentType(e.value)} checked={appointmentType === '3'} />
                                    <label htmlFor="type3" className="ms-1 small cursor-pointer">Domiciliaria</label>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">TIPO DE CONSULTA *</label>
                        <Dropdown
                            value={consultationType}
                            options={consultationTypes || []}
                            optionLabel="label"
                            optionValue="value"
                            onChange={(e) => setConsultationType(e.value)}
                            placeholder="Seleccione..."
                            className={classNames("w-100", { "p-invalid": !consultationType })}
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">FINALIDAD *</label>
                        <Dropdown
                            value={consultationPurpose}
                            options={consultationPurposes || []}
                            optionLabel="label"
                            optionValue="value"
                            onChange={(e) => setConsultationPurpose(e.value)}
                            placeholder="Seleccione..."
                            className={classNames("w-100", { "p-invalid": !consultationPurpose })}
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold text-muted">CAUSA EXTERNA *</label>
                        <Dropdown
                            value={externalCause}
                            options={externalCauses || []}
                            optionLabel="label"
                            optionValue="value"
                            onChange={(e) => setExternalCause(e.value)}
                            placeholder="Seleccione..."
                            className={classNames("w-100", { "p-invalid": !externalCause })}
                        />
                    </div>
                </div>

                {/* Right Grid Panel */}
                <div className="flex-grow-1 p-4 d-flex flex-column h-100" style={{ overflow: 'hidden' }}>
                    <div className="h-100 d-flex flex-column">
                        <div className="d-flex align-items-center mb-3 pb-2 border-bottom flex-shrink-0">
                            <h5 className="text-primary mb-0 fw-bold">
                                <i className="fas fa-list-ul me-2"></i>
                                Resultados ({allSlots.length})
                            </h5>
                        </div>

                        {allSlots.length === 0 ? (
                            <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center text-muted opacity-50">
                                <i className="fas fa-calendar-times fa-3x mb-3"></i>
                                <p>No hay horarios disponibles.</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex-grow-1 overflow-auto pe-2">
                                    <div className="row g-2">
                                        {visibleSlots.map(renderSlotItem)}
                                    </div>
                                </div>
                                <div className="flex-shrink-0 mt-3 pt-2 border-top">
                                    <Paginator
                                        first={first}
                                        rows={rows}
                                        totalRecords={allSlots.length}
                                        onPageChange={(e) => { setFirst(e.first); setRows(e.rows); }}
                                    />
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
