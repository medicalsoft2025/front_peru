
import React, { useState, useEffect } from 'react';
import { AppointmentsSummaryCard } from '../layout/home-cards/AppointmentsSummaryCard';
import { PatientsSummaryCard } from '../layout/home-cards/PatientsSummaryCard';
import { ConsultationsSummaryCard } from '../layout/home-cards/ConsultationsSummaryCard';
import { AdmissionsSummaryCard } from '../layout/home-cards/AdmissionsSummaryCard';
import { AppointmentsCalendar } from './components/AppointmentsCalendar';
import { userSpecialtyService, userService } from '../../services/api';
import { Dropdown } from 'primereact/dropdown';
import { Accordion, AccordionTab } from 'primereact/accordion';

const Dashboard = () => {
    const [specialties, setSpecialties] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);
    const [selectedSpecialty, setSelectedSpecialty] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const specsResponse = await userSpecialtyService.getAll();
                setSpecialties(Array.isArray(specsResponse) ? specsResponse : (specsResponse.data || []));

                const docsResponse = await userService.getAll();
                setDoctors(Array.isArray(docsResponse) ? docsResponse : (docsResponse.data || []));
            } catch (e) {
                console.error("Error loading dashboard filters", e);
            }
        };
        fetchData();
    }, []);

    const doctorOptionTemplate = (option: any) => {
        if (!option) return 'Seleccionar Médico';
        return `${option.first_name || ''} ${option.last_name || ''}`;
    };

    return (
        <div className="content">
            <style>{`
                /* Contenedor unificado para las tarjetas */
                .dashboard-cards-container {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    gap: 20px;
                    margin-bottom: 2rem;
                }

                .dashboard-card-wrapper {
                    flex: 0 0 auto;
                    margin-bottom: 1rem;
                }

                .dashboard-card {
                    width: 250px;
                    height: 235px;
                    border-radius: 10%;
                    background-color: var(--secondary-color) !important;
                    color: #f8f9fa !important;
                    display: flex;
                    flex-direction: column;
                    margin-top: 20px !important;
                }

                .dashboard-card .card-body {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    padding: 1.25rem;
                }

                .dashboard-card .card-title {
                    text-align: center;
                    color: #f8f9fa !important;
                    font-size: 1.1rem;
                    margin-bottom: 0.5rem;
                    min-height: 2.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .dashboard-card .card-content {
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    margin: 0.5rem 0;
                }

                .dashboard-card h3 {
                    text-align: center;
                    color: #f8f9fa !important;
                    margin-bottom: 0.5rem !important;
                    font-size: 1.8rem !important;
                    font-weight: bold !important;
                }

                .text-span-descripcion {
                    text-align: center;
                    font-weight: 700;
                    color: rgba(var(--phoenix-secondary-lighter-rgb), var(--phoenix-text-opacity)) !important;
                    margin-bottom: 0.5rem;
                }

                .dashboard-card .card-button {
                    display: flex;
                    justify-content: center;
                    margin-top: auto;
                }

                /* Override React component styles wrappers if needed */
                #patientsSummaryCardReact .card,
                #appointmentsSummaryCardReact .card,
                #consultationsSummaryCardReact .card,
                #AdmissionsSummaryCard .card  {
                     width: 250px !important;
                     height: 235px;
                     border-radius: 10% !important;
                     background-color: var(--secondary-color) !important;
                     color: #f8f9fa !important;
                     display: flex !important;
                     flex-direction: column !important;
                }
             `}</style>

            <div className="dashboard-cards-container">
                <div className="dashboard-card-wrapper" id="patientsSummaryCardReact">
                    <PatientsSummaryCard />
                </div>
                <div className="dashboard-card-wrapper" id="appointmentsSummaryCardReact">
                    <AppointmentsSummaryCard />
                </div>
                <div className="dashboard-card-wrapper" id="consultationsSummaryCardReact">
                    <ConsultationsSummaryCard />
                </div>
                <div className="dashboard-card-wrapper" id="AdmissionsSummaryCard">
                    <AdmissionsSummaryCard />
                </div>
            </div>

            <hr className="bg-body-secondary mb-6 mt-4" />

            <h1>holaaaaa</h1>

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

            <AppointmentsCalendar
                specialtyId={selectedSpecialty}
                doctorId={selectedDoctor}
            />

            <hr className="bg-body-secondary mb-6 mt-4" />
        </div>
    );
};

export default Dashboard;
