import React, { useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import GeneralInfoForm from './components/GeneralInfoForm';
import { Company, WhatsAppStatus } from '../company-configuration/types/consultorio';
import RepresentativeTab from '../company-configuration/components/RepresentativeTab';
import CommunicationsTab from '../company-configuration/components/CommunicationsTab';
import BranchesTab from '../company-configuration/components/BranchesTab';

interface CompanyFormProps {
    company: Company | null;
    onClose: () => void;
    onSaveSuccess: () => void;
}

export const CompanyForm: React.FC<CompanyFormProps> = ({ company, onClose, onSaveSuccess }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [whatsAppStatus, setWhatsAppStatus] = useState<WhatsAppStatus>({
        connected: false,
    });

    const getTabHeader = (icon: string, label: string) => {
        return (
            <div className="flex align-items-center gap-2">
                <i className={icon}></i>
                <span>{label}</span>
            </div>
        );
    };

    // If company exists, we can show all tabs. If not (new company), only show General Info first.
    // Or we could disable other tabs until General Info is saved.
    const isNew = !company;
    const companyId = company?.id?.toString();

    const handleGeneralInfoSuccess = () => {
        // If it was a new company, maybe we should close or reload to show it.
        // For now, simple success callback. The parent decides if we need to reload list or what.
        onSaveSuccess();
    };

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <TabView
                        activeIndex={activeIndex}
                        onTabChange={(e) => setActiveIndex(e.index)}
                        className="company-config-tabs"
                    >
                        <TabPanel
                            header={getTabHeader("fa-solid fa-circle-info", "Información General")}
                        >
                            <GeneralInfoForm
                                company={company}
                                onSuccess={handleGeneralInfoSuccess}
                            />
                        </TabPanel>

                        <TabPanel
                            header={getTabHeader("fa-solid fa-address-book", "Representante")}
                            disabled={isNew}
                        >
                            <RepresentativeTab
                                companyId={companyId}
                            />
                        </TabPanel>

                        <TabPanel
                            header={getTabHeader("fa-solid fa-envelopes-bulk", "Comunicaciones")}
                            disabled={isNew}
                        >
                            <CommunicationsTab
                                companyId={companyId}
                                whatsAppStatus={whatsAppStatus}
                                onStatusChange={setWhatsAppStatus}
                            />
                        </TabPanel>

                        <TabPanel
                            header={getTabHeader("fa-solid fa-location-dot", "Sedes")}
                            disabled={isNew}
                        >
                            <BranchesTab
                                companyId={companyId}
                            />
                        </TabPanel>
                    </TabView>
                </div>
            </div>
        </div>
    );
};
