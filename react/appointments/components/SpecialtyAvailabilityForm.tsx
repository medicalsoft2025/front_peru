import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { useQuery } from '@tanstack/react-query';
import { userAvailabilityService, appointmentTypeService, userSpecialtyService } from '../../../services/api';
import { AvailabilityData } from './types';
import { classNames } from 'primereact/utils';

interface SpecialtyAvailabilityFormProps {
    onAvailabilityFound: (data: AvailabilityData[], filters?: any) => void;
    onLoading: (isLoading: boolean) => void;
}

export const SpecialtyAvailabilityForm: React.FC<SpecialtyAvailabilityFormProps> = ({ onAvailabilityFound, onLoading }) => {
    const [specialtyId, setSpecialtyId] = useState<number | null>(null);
    const [date, setDate] = useState<Date | null>(new Date());
    const [appointmentTypeId, setAppointmentTypeId] = useState<number | null>(1); // Default Presencial

    // Fetch Specialties
    const { data: specialties } = useQuery({
        queryKey: ['user-specialties'],
        queryFn: () => userSpecialtyService.getAll().then(res => res.data || res),
        staleTime: 1000 * 60 * 60
    });

    // Fetch Appointment Types
    const { data: appointmentTypes } = useQuery({
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

            const selectedSpecialty = specialties?.find((s: any) => s.id === specialtyId);

            const filters = {
                user_specialty_id: specialtyId,
                specialty_name: selectedSpecialty?.name, // Pass name for display
                start_date: dateStr,
                end_date: dateStr,
                appointment_type_id: appointmentTypeId
            };

            const response = await userAvailabilityService.availableBlocks(filters);
            // Assuming response is the array or response.data
            const data = Array.isArray(response) ? response : (response.data || []);
            onAvailabilityFound(data, filters);
        } catch (error) {
            console.error("Error fetching availability", error);
        } finally {
            onLoading(false);
        }
    };

    return (
        <div className="p-4 border rounded bg-light">
            <div className="row g-3">
                <div className="col-md-6">
                    <label className="form-label small fw-bold">Especialidad</label>
                    <Dropdown
                        value={specialtyId}
                        options={specialties || []}
                        optionLabel="name"
                        optionValue="id"
                        onChange={(e) => setSpecialtyId(e.value)}
                        placeholder="Seleccione..."
                        className="w-100"
                        filter
                    />
                </div>
                <div className="col-md-6">
                    <label className="form-label small fw-bold">Fecha</label>
                    <Calendar
                        value={date}
                        onChange={(e) => setDate(e.value as Date)}
                        showIcon
                        dateFormat="yy-mm-dd"
                        className="w-100"
                        minDate={new Date()} // Prevent past dates
                    />
                </div>

                <div className="col-12">
                    <label className="form-label small fw-bold d-block">Tipo de Cita</label>
                    <div className="d-flex gap-4">
                        {appointmentTypes?.map((type: any) => (
                            <div key={type.id} className="d-flex align-items-center">
                                <RadioButton
                                    inputId={`type-${type.id}`}
                                    name="appointmentType"
                                    value={type.id}
                                    onChange={(e) => setAppointmentTypeId(e.value)}
                                    checked={appointmentTypeId === type.id}
                                />
                                <label htmlFor={`type-${type.id}`} className="ms-2 small cursor-pointer">
                                    {type.name}
                                </label>
                            </div>
                        ))}
                        {/* Fallback if no types loaded yet */}
                        {!appointmentTypes && (
                            <small className="text-muted">Cargando tipos...</small>
                        )}
                    </div>
                </div>

                <div className="col-12 d-flex justify-content-end mt-3">
                    <Button
                        type="button"
                        label="Buscar Espacios"
                        icon="pi pi-search"
                        onClick={handleSearch}
                        disabled={!specialtyId || !date}
                    />
                </div>
            </div>
        </div>
    );
};
