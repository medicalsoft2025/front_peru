import React, { useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { Button } from 'primereact/button';
import { EnvironmentalCalendarFilterItemInterface } from '../interfaces/types';
import { useEnvironmentalWasteRecordsFiltered } from '../hooks/waste-records/useEnvironmentalWasteRecordsFiltered';
import { useEnvironmentalTemperatureRecordsFiltered } from '../hooks/temperature-records/useEnvironmentalTemperatureRecordsFiltered';
import { useEnvironmentalHumidityRecordsFiltered } from '../hooks/humidity-records/useEnvironmentalHumidityRecordsFiltered';
import { useEnvironmentalCleaningRecordsFiltered } from '../hooks/cleaning-records/useEnvironmentalCleaningRecordsFiltered';

interface EnvironmentalCalendarProps {
    type: 'waste' | 'temperature' | 'humidity' | 'cleaning';
    selectedCategory?: EnvironmentalCalendarFilterItemInterface | null;
    selectedArea?: EnvironmentalCalendarFilterItemInterface | null;
    selectedProtocol?: EnvironmentalCalendarFilterItemInterface | null;
    selectedIssuer?: string | null;
}

export const EnvironmentalCalendar = ({
    type,
    selectedCategory,
    selectedArea,
    selectedProtocol,
    selectedIssuer
}: EnvironmentalCalendarProps) => {
    const calendarRef = useRef<FullCalendar>(null);
    const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);

    // Fetch Waste Records
    const { wasteRecords, refetch: refetchWaste } = useEnvironmentalWasteRecordsFiltered(
        {
            start_date: dateRange?.start || '',
            end_date: dateRange?.end || '',
            category_id: selectedCategory?.id || '',
            issuer_id: selectedIssuer || ''
        },
        { enabled: type === 'waste' && !!dateRange && !!selectedCategory }
    );

    // Fetch Temperature Records
    const { temperatureRecords, refetch: refetchTemp } = useEnvironmentalTemperatureRecordsFiltered(
        {
            start_date: dateRange?.start || '',
            end_date: dateRange?.end || '',
            environmental_area_id: selectedArea?.id || ''
        },
        { enabled: type === 'temperature' && !!dateRange && !!selectedArea }
    );

    // Fetch Humidity Records
    const { humidityRecords, refetch: refetchHumidity } = useEnvironmentalHumidityRecordsFiltered(
        {
            start_date: dateRange?.start || '',
            end_date: dateRange?.end || '',
            environmental_area_id: selectedArea?.id || ''
        },
        { enabled: type === 'humidity' && !!dateRange && !!selectedArea }
    );

    // Fetch Cleaning Records
    const { cleaningRecords, refetch: refetchCleaning } = useEnvironmentalCleaningRecordsFiltered(
        {
            start_date: dateRange?.start || '',
            end_date: dateRange?.end || '',
            environmental_area_protocol_id: selectedProtocol?.id || ''
        },
        { enabled: type === 'cleaning' && !!dateRange && !!selectedProtocol }
    );

    const onDatesSet = (arg: any) => {
        // FullCalendar provides start/end dates for the visible view (including buffer days)
        // Adjust formatting to YYYY-MM-DD
        const start = arg.start.toISOString().split('T')[0];
        const end = arg.end.toISOString().split('T')[0];
        setDateRange({ start, end });
    };

    const handleRefresh = () => {
        if (type === 'waste') refetchWaste();
        if (type === 'temperature') refetchTemp();
        if (type === 'humidity') refetchHumidity();
        if (type === 'cleaning') refetchCleaning();
    };

    const getEvents = () => {
        if (type === 'waste' && wasteRecords) {
            return wasteRecords.map(r => ({
                id: r.id.toString(),
                title: `${r.value} kg`, // Title for accessibility/fallback
                start: r.date,
                allDay: true,
                extendedProps: { value: r.value }
            }));
        }
        if (type === 'temperature' && temperatureRecords) {
            return temperatureRecords.map(r => ({
                id: r.id.toString(),
                title: 'Temperature',
                start: r.date,
                allDay: true,
                extendedProps: { value_am: r.value_am, value_pm: r.value_pm }
            }));
        }
        if (type === 'humidity' && humidityRecords) {
            return humidityRecords.map(r => ({
                id: r.id.toString(),
                title: 'Humidity',
                start: r.date,
                allDay: true,
                extendedProps: { value_am: r.value_am, value_pm: r.value_pm }
            }));
        }
        if (type === 'cleaning' && cleaningRecords) {
            return cleaningRecords.filter(r => r.is_compliant).map(r => ({
                id: r.id.toString(),
                title: 'Compliant',
                start: r.date,
                allDay: true,
                display: 'background', // Or just render content
                extendedProps: { is_compliant: r.is_compliant }
            }));
        }
        return [];
    };

    const renderEventContent = (eventInfo: any) => {
        const props = eventInfo.event.extendedProps;

        if (type === 'waste') {
            return (
                <div className="text-center p-1" style={{ fontSize: '0.9em' }}>
                    <strong>{props.value} kg</strong>
                </div>
            );
        }
        if (type === 'temperature') {
            return (
                <div className="d-flex flex-column align-items-center gap-1 p-1" style={{ fontSize: '0.75em' }}>
                    {props.value_am && <span><i className="fa-solid fa-sun text-warning me-1"></i>{props.value_am}°C</span>}
                    {props.value_pm && <span><i className="fa-solid fa-moon text-secondary me-1"></i>{props.value_pm}°C</span>}
                </div>
            );
        }
        if (type === 'humidity') {
            return (
                <div className="d-flex flex-column align-items-center gap-1 p-1" style={{ fontSize: '0.75em' }}>
                    {props.value_am && <span><i className="fa-solid fa-sun text-warning me-1"></i>{props.value_am}%</span>}
                    {props.value_pm && <span><i className="fa-solid fa-moon text-secondary me-1"></i>{props.value_pm}%</span>}
                </div>
            );
        }
        if (type === 'cleaning') {
            // For cleaning, we only return events if is_compliant is true
            return (
                <div className="d-flex justify-content-center align-items-center h-100">
                    <i className="fa-solid fa-check-circle text-success" style={{ fontSize: '1.5em' }}></i>
                </div>
            );
        }
        return <>{eventInfo.event.title}</>;
    };

    return (
        <div className="d-flex flex-column h-100 w-100">
            <div className="d-flex justify-content-end mb-2">
                <Button
                    icon={<i className="fa-solid fa-sync" />}
                    onClick={handleRefresh}
                    tooltip="Actualizar"
                    className="p-button-text p-button-rounded"
                />
            </div>
            <div className="flex-grow-1" style={{ position: 'relative', zIndex: 0 }}>
                {/* Z-index fix for some calendar overlaps if needed */}
                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    locale={esLocale}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth'
                    }}
                    height="100%"
                    events={getEvents()}
                    eventContent={renderEventContent}
                    datesSet={onDatesSet}
                    eventBackgroundColor="transparent"
                    eventBorderColor="transparent"
                    eventTextColor="#212529"
                />
            </div>
        </div>
    );
};