import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Representative } from '../../company-configuration/types/consultorio';
import { SwalManager } from '../../../../services/alertManagerImported';
import { companyService } from '../../../../services/api';

interface CompanyRepresentativeTabProps {
    companyId?: number;
    initialRepresentative?: Representative | null;
}

export const CompanyRepresentativeTab: React.FC<CompanyRepresentativeTabProps> = ({
    companyId,
    initialRepresentative
}) => {
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset
    } = useForm<Representative>({
        defaultValues: initialRepresentative || {
            name: '',
            phone: '',
            email: '',
            document_type: '',
            document_number: ''
        },
        mode: 'onChange'
    });

    useEffect(() => {
        if (initialRepresentative) {
            reset(initialRepresentative);
        } else {
            reset({
                name: '',
                phone: '',
                email: '',
                document_type: '',
                document_number: ''
            });
        }
    }, [initialRepresentative, reset]);

    const documentTypes = [
        { label: 'RNC', value: 'RNC' },
        { label: 'PASSPORTE', value: 'PASSPORT' },
        { label: 'NIT', value: 'NIT' },
        { label: 'CEDULA DE CIUDADANIA', value: 'CC' }
    ];

    const onSubmit = async (data: Representative) => {
        if (!companyId) {
            SwalManager.error('Debe guardar la empresa antes de agregar el representante.');
            return;
        }

        setLoading(true);
        try {
            let response;
            // Use local data.id determines if it is an update or create?
            // Wait, data coming from form might default to ID if we reset with it.
            // But if initialRepresentative is null, data.id is undefined.
            const isUpdate = !!(initialRepresentative && initialRepresentative.id);

            if (isUpdate) {
                // Ensure we send the ID if it's an update
                const payload = { ...data, id: initialRepresentative?.id };
                response = await companyService.updateRepresentative(companyId, payload);
                SwalManager.success('Representante Legal actualizado correctamente');
            } else {
                response = await companyService.createRepresentative(companyId, data);
                SwalManager.success('Representante Legal creado correctamente');
            }
        } catch (error) {
            console.error('Error saving representative:', error);
            SwalManager.error('Error al guardar el representante');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-sm">
            <div className="container-fluid">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row mb-4">
                        <div className="col-12">
                            <h5 className="fw-bold mb-3">Información del Representante Legal</h5>
                            {!companyId && (
                                <div className="alert alert-warning">
                                    Guarde la información general de la empresa para habilitar esta sección.
                                </div>
                            )}
                        </div>

                        <div className="col-12 mb-3">
                            <label htmlFor="name" className="form-label">
                                Nombre Completo <span className="text-danger">*</span>
                            </label>
                            <Controller
                                name="name"
                                control={control}
                                rules={{
                                    required: 'El nombre del Representante no puede estar vacío',
                                    minLength: {
                                        value: 2,
                                        message: 'El nombre debe tener al menos 2 caracteres'
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        id="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="Jhon Doe"
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.name && (
                                <div className="invalid-feedback d-block">
                                    {errors.name.message}
                                </div>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="phone" className="form-label">
                                Teléfono
                            </label>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^\+?[\d\s\-\(\)]+$/,
                                        message: 'Formato de teléfono inválido'
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        id="phone"
                                        className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                        placeholder="+57 300 123 4567"
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.phone && (
                                <div className="invalid-feedback d-block">
                                    {errors.phone.message}
                                </div>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="email" className="form-label">
                                Correo Electrónico
                            </label>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Formato de email inválido'
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        id="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="ejemplo@correo.com"
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.email && (
                                <div className="invalid-feedback d-block">
                                    {errors.email.message}
                                </div>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="document_type" className="form-label">
                                Tipo de Documento <span className="text-danger">*</span>
                            </label>
                            <Controller
                                name="document_type"
                                control={control}
                                rules={{ required: 'Seleccione un Tipo de Documento' }}
                                render={({ field }) => (
                                    <Dropdown
                                        {...field}
                                        id="document_type"
                                        options={documentTypes}
                                        placeholder="Seleccione un tipo de documento"
                                        className={`w-100 ${errors.document_type ? 'is-invalid' : ''}`}
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.document_type && (
                                <div className="invalid-feedback d-block">
                                    {errors.document_type.message}
                                </div>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="document_number" className="form-label">
                                Número de Documento <span className="text-danger">*</span>
                            </label>
                            <Controller
                                name="document_number"
                                control={control}
                                rules={{
                                    required: 'El Documento no puede estar vacío',
                                    minLength: {
                                        value: 3,
                                        message: 'El documento debe tener al menos 3 caracteres'
                                    }
                                }}
                                render={({ field }) => (
                                    <InputText
                                        {...field}
                                        id="document_number"
                                        className={`form-control ${errors.document_number ? 'is-invalid' : ''}`}
                                        placeholder="123456789"
                                        disabled={!companyId}
                                    />
                                )}
                            />
                            {errors.document_number && (
                                <div className="invalid-feedback d-block">
                                    {errors.document_number.message}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 d-flex justify-content-end">
                            <Button
                                type="submit"
                                label="Guardar Representante"
                                icon="pi pi-save"
                                loading={loading}
                                className="p-button-primary"
                                disabled={!companyId || !isValid}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Card>
    );
};
