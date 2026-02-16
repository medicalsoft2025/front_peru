
import React, { useState, useEffect } from 'react';
import { AppointmentsSummaryCard } from '../layout/home-cards/AppointmentsSummaryCard';
import { PatientsSummaryCard } from '../layout/home-cards/PatientsSummaryCard';
import { ConsultationsSummaryCard } from '../layout/home-cards/ConsultationsSummaryCard';
import { AdmissionsSummaryCard } from '../layout/home-cards/AdmissionsSummaryCard';
import { FullCalendarComponent } from '../components/full-calendar/FullCalendarComponent';
import { userSpecialtyService, userService } from '../../services/api';
import { Dropdown } from 'primereact/dropdown';
import { Accordion, AccordionTab } from 'primereact/accordion';

// Helper to format doctor name
const doctorOptionTemplate = (option) => {
    if (!option) return 'Seleccionar Médico';
    return `${option.first_name || ''} ${option.last_name || ''}`;
};

const Dashboard = () => {
    const [specialties, setSpecialties] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const specsResponse = await userSpecialtyService.getAll();
                // Handle response format variations (array vs {data: array})
                setSpecialties(Array.isArray(specsResponse) ? specsResponse : (specsResponse.data || []));

                const docsResponse = await userService.getAll();
                setDoctors(Array.isArray(docsResponse) ? docsResponse : (docsResponse.data || []));
            } catch (e) {
                console.error("Error loading dashboard filters", e);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="content">
            <div className="dashboard-cards-container">
                <div className="dashboard-card-wrapper">
                    <PatientsSummaryCard />
                </div>
                <div className="dashboard-card-wrapper">
                    <AppointmentsSummaryCard />
                </div>
                <div className="dashboard-card-wrapper">
                    <ConsultationsSummaryCard />
                </div>
                <div className="dashboard-card-wrapper">
                    <AdmissionsSummaryCard />
                </div>
            </div>

            <hr className="bg-body-secondary mb-6 mt-4" />

            <div className="mb-4">
                <Accordion activeIndex={null}>
                    <AccordionTab header="Filtros">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <label className="form-label display-block">Especialidad Médica</label>
                                <Dropdown
                                    value={selectedSpecialty}
                                    options={specialties}
                                    onChange={(e) => setSelectedSpecialty(e.value)}
                                    optionLabel="name"
                                    optionValue="id"
                                    placeholder="Seleccionar Especialidad"
                                    className="w-100"
                                    style={{ width: '100%' }}
                                    showClear
                                    filter
                                />
                            </div>
                            <div className="col-md-6 mb-2">
                                <label className="form-label display-block">Médico</label>
                                <Dropdown
                                    value={selectedDoctor}
                                    options={doctors}
                                    onChange={(e) => setSelectedDoctor(e.value)}
                                    optionLabel="first_name"
                                    itemTemplate={doctorOptionTemplate}
                                    valueTemplate={doctorOptionTemplate}
                                    optionValue="id"
                                    placeholder="Seleccionar Médico"
                                    className="w-100"
                                    style={{ width: '100%' }}
                                    showClear
                                    filter
                                />
                            </div>
                        </div>
                    </AccordionTab>
                </Accordion>
            </div>

            <FullCalendarComponent
                specialtyId={selectedSpecialty}
                doctorId={selectedDoctor}
            />

            <hr className="bg-body-secondary mb-6 mt-4" />
        </div>
    );
};

export default Dashboard;
