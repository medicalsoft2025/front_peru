import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { TabView, TabPanel } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { EnvironmentalWasteForm } from './forms/EnvironmentalWasteForm';
import { EnvironmentalTemperatureForm } from './forms/EnvironmentalTemperatureForm';
import { EnvironmentalHumidityForm } from './forms/EnvironmentalHumidityForm';
import { EnvironmentalCleaningForm } from './forms/EnvironmentalCleaningForm';
import { useEnvironmentalWasteRecordCreate } from '../hooks/waste-records/useEnvironmentalWasteRecordCreate';
import { useEnvironmentalTemperatureRecordCreate } from '../hooks/temperature-records/useEnvironmentalTemperatureRecordCreate';
import { useEnvironmentalHumidityRecordCreate } from '../hooks/humidity-records/useEnvironmentalHumidityRecordCreate';
import { useEnvironmentalCleaningRecordCreate } from '../hooks/cleaning-records/useEnvironmentalCleaningRecordCreate';

interface EnvironmentalRecordFormDialogProps {
    visible: boolean;
    onHide: () => void;
}

export const EnvironmentalRecordFormDialog = ({ visible, onHide }: EnvironmentalRecordFormDialogProps) => {
    const [date, setDate] = useState<Date>(new Date());
    const [activeIndex, setActiveIndex] = useState(0);

    // Create hooks
    const { createEnvironmentalWasteRecord, loading: wasteLoading, toast: wasteToast } = useEnvironmentalWasteRecordCreate();
    const { createEnvironmentalTemperatureRecord, loading: tempLoading, toast: tempToast } = useEnvironmentalTemperatureRecordCreate();
    const { createEnvironmentalHumidityRecord, loading: humidityLoading, toast: humidityToast } = useEnvironmentalHumidityRecordCreate();
    const { createEnvironmentalCleaningRecord, loading: cleaningLoading, toast: cleaningToast } = useEnvironmentalCleaningRecordCreate();

    const getActiveFormId = () => {
        switch (activeIndex) {
            case 0: return 'waste-form';
            case 1: return 'temperature-form';
            case 2: return 'humidity-form';
            case 3: return 'cleaning-form';
            default: return '';
        }
    };

    const handleSuccess = () => {
        setTimeout(() => {
            onHide();
        }, 1000);
    };

    return (
        <Dialog
            header="Nuevo Registro Ambiental"
            visible={visible}
            onHide={onHide}
            style={{ width: '80vw', height: '80vh' }}
            footer={
                <div className="d-flex justify-content-end gap-2">
                    <Button
                        label="Cancelar"
                        severity="secondary"
                        onClick={onHide}
                        icon={<i className="fa-solid fa-times me-1" />}
                    />
                    <Button
                        label="Guardar"
                        type="submit"
                        form={getActiveFormId()}
                        icon={<i className="fa-solid fa-save me-1" />}
                    />
                </div>
            }
        >
            <Toast ref={wasteToast} />
            <Toast ref={tempToast} />
            <Toast ref={humidityToast} />
            <Toast ref={cleaningToast} />

            <div className="d-flex flex-column gap-3">
                <div className="d-flex flex-column gap-2">
                    <label htmlFor="date" className="fw-bold">Fecha</label>
                    <Calendar
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.value as Date)}
                        dateFormat="dd/mm/yy"
                        showIcon
                        className="w-100"
                    />
                </div>

                <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)}>
                    <TabPanel header="Residuos">
                        <EnvironmentalWasteForm
                            formId="waste-form"
                            date={date}
                            onSave={async (data) => {
                                await createEnvironmentalWasteRecord(data);
                                handleSuccess();
                            }}
                        />
                    </TabPanel>

                    <TabPanel header="Temperatura">
                        <EnvironmentalTemperatureForm
                            formId="temperature-form"
                            date={date}
                            onSave={async (data) => {
                                await createEnvironmentalTemperatureRecord(data);
                                handleSuccess();
                            }}
                        />
                    </TabPanel>

                    <TabPanel header="Humedad">
                        <EnvironmentalHumidityForm
                            formId="humidity-form"
                            date={date}
                            onSave={async (data) => {
                                await createEnvironmentalHumidityRecord(data);
                                handleSuccess();
                            }}
                        />
                    </TabPanel>

                    <TabPanel header="Limpieza y desinfección">
                        <EnvironmentalCleaningForm
                            formId="cleaning-form"
                            date={date}
                            onSave={async (data) => {
                                await createEnvironmentalCleaningRecord(data);
                                handleSuccess();
                            }}
                        />
                    </TabPanel>
                </TabView>
            </div>
        </Dialog>
    );
};
