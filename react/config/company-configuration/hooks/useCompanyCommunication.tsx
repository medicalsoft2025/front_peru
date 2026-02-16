import { useState, useEffect } from 'react';
import { Company, SmtpConfig } from '../types/consultorio';
import { companyService } from '../../../../services/api';
import { SwalManager } from '../../../../services/alertManagerImported';

export const useCompanyCommunication = (companyId?: string | number) => {
    const [company, setCompany] = useState<Company | null>(null);
    const [communication, setCommunication] = useState<SmtpConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const fetchCommunicationData = async () => {
        try {
            setLoading(true);
            setError(null);

            let response;
            let companyData;

            if (companyId) {
                response = await companyService.getCompany(companyId);
                // response.data usually contains the object directly for getCompany?
                // Based on service: return response; (axios response)
                // getCompany url: .../companies/${companyId}?include=...
                // Usually returns single object.
                // But check service implementation:
                // async getCompany(companyId) { ... return response; }

                // Let's assume standard behavior: response.data.data or response.data is the item.
                // But generally in this codebase it seems response.data is the payload.
                if (response.status === 200 && response.data) {
                    // Check if response.data is array or object. 
                    // Usually find(id) returns object.
                    companyData = Array.isArray(response.data) ? response.data[0] : response.data;
                    // Sometimes it might be response.data.data
                    if (response.data.data && !Array.isArray(response.data)) companyData = response.data.data;
                }
            } else {
                response = await companyService.getAllCompanies();
                if (response.status === 200 && response.data && response.data.length > 0) {
                    companyData = response.data[0];
                }
            }

            if (companyData) {
                setCompany(companyData);

                // Handle nested structure which might vary
                const commData = companyData.communication || (companyData.includes && companyData.includes.communication);

                if (commData) {
                    const mappedCommunication: SmtpConfig = {
                        id: commData.id,
                        company_id: commData.company_id,
                        smtp_server: commData.smtp_server,
                        port: commData.port,
                        security: commData.security,
                        email: commData.email,
                        password: commData.password,
                        api_key: commData.api_key,
                        instance: commData.instance,
                        created_at: commData.created_at,
                        updated_at: commData.updated_at
                    };

                    setCommunication(mappedCommunication);
                } else {
                    setCommunication(null);
                }
            } else {
                // Only error if specific ID was requested and failed
                if (companyId) setError('No se encontraron datos de la compañía');
                // If no ID and no companies, also maybe error or just empty
            }
        } catch (err) {
            console.error('Error fetching communication data:', err);
            setError('Error al cargar los datos de comunicación');
        } finally {
            setLoading(false);
        }
    };

    const saveCommunication = async (data: SmtpConfig): Promise<SmtpConfig> => {
        // Usamos el company_id que viene en los datos de communication
        const companyId = company?.id;

        console.log('company', company);

        if (!companyId) {
            throw new Error('No se encontró company_id en la configuración');
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            let response;

            if (communication?.id) {
                console.log('Actualizando comunicación para companyId:', companyId);
                response = await companyService.updateCommunication(companyId, data);
                SwalManager.success('Configuración SMTP se actualizó correctamente');
            } else {
                console.log('Creando comunicación para companyId:', companyId);
                response = await companyService.createCommunication(companyId, data);
                SwalManager.success('Configuración SMTP se creó correctamente');
            }

            if (response.status === 200 || response.status === 201) {
                const savedData = response.data;
                const savedCommunication: SmtpConfig = {
                    id: savedData.id,
                    company_id: savedData.company_id,
                    smtp_server: savedData.smtp_server,
                    port: savedData.port,
                    security: savedData.security,
                    email: savedData.email,
                    password: savedData.password,
                    api_key: savedData.api_key,
                    instance: savedData.instance,
                    created_at: savedData.created_at,
                    updated_at: savedData.updated_at
                };

                setCommunication(savedCommunication);
                return savedCommunication;
            }
        } catch (err) {
            console.error('Error saving communication:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al guardar la configuración de comunicación';
            setSubmitError(errorMessage);
            SwalManager.error('Error al guardar la configuración SMTP');
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchCommunicationData();
    }, [companyId]);

    const refetch = () => {
        fetchCommunicationData();
    };

    return {
        communication,
        loading,
        error,
        isSubmitting,
        submitError,
        refetch,
        saveCommunication
    };
};