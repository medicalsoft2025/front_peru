import { useState, useEffect } from 'react';
import { Representative } from '../types/consultorio';
import { companyService } from '../../../../services/api';
import { SwalManager } from '../../../../services/alertManagerImported';

export const useCompanyRepresentative = (companyId?: string | number) => {
    const [representative, setRepresentative] = useState<Representative | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const fetchRepresentativeData = async () => {
        try {
            setLoading(true);
            setError(null);

            let companyData;

            if (companyId) {
                const response = await companyService.getCompany(companyId);
                if (response.status === 200 && response.data) {
                    companyData = Array.isArray(response.data) ? response.data[0] : response.data;
                    // Handle nested data wrapper if present
                    if (companyData.data && !Array.isArray(companyData)) companyData = companyData.data;
                }
            } else {
                const response = await companyService.getAllCompanies();
                if (response.status === 200 && response.data && response.data.length > 0) {
                    companyData = response.data[0];
                }
            }

            if (companyData) {
                // Handle nested structure from getCompany vs getAllCompanies
                const repData = companyData.representative || (companyData.includes && companyData.includes.representative);

                if (repData) {
                    const mappedRepresentative: Representative = {
                        id: repData.id,
                        company_id: repData.company_id,
                        name: repData.name,
                        phone: repData.phone,
                        email: repData.email,
                        document_type: repData.document_type,
                        document_number: repData.document_number,
                    };

                    setRepresentative(mappedRepresentative);
                } else {
                    setRepresentative(null);
                }
            } else {
                if (companyId) setError('No se encontraron datos de la compañía');
            }
        } catch (err) {
            console.error('Error fetching representative data:', err);
            setError('Error al cargar los datos del representante');
        } finally {
            setLoading(false);
        }
    };

    const saveRepresentative = async (companyId: string, data: Representative): Promise<Representative> => {
        if (!companyId) {
            throw new Error('companyId es requerido');
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            let response;

            if (data.id) {
                response = await companyService.updateRepresentative(companyId, data);
                SwalManager.success('Representante Legal se actualizo correctamente');

            } else {
                response = await companyService.createRepresentative(companyId, data);
                SwalManager.success('Representante Legal se Creo correctamente');

            }

            if (response.status === 200 || response.status === 201) {
                const savedData = response.data;
                const savedRepresentative: Representative = {
                    id: savedData.id,
                    company_id: savedData.company_id,
                    name: savedData.name,
                    phone: savedData.phone,
                    email: savedData.email,
                    document_type: savedData.document_type,
                    document_number: savedData.document_number,
                };

                setRepresentative(savedRepresentative);
                SwalManager.success('Representante Legal');

                return savedRepresentative;
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (err) {
            setSubmitError(err);
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        fetchRepresentativeData();
    }, [companyId]);

    const refetch = () => {
        fetchRepresentativeData();
    };

    return {
        representative,
        loading,
        error,
        isSubmitting,
        submitError,
        refetch,
        saveRepresentative
    };
};