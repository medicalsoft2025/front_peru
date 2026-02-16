import React, { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Company } from "../../company-configuration/types/consultorio";

interface CompanyGeneralInfoTabProps {
    company?: Company | null;
    onSave: (data: Company, logo?: File, watermark?: File) => void;
}

export const CompanyGeneralInfoTab: React.FC<CompanyGeneralInfoTabProps> = ({
    company,
    onSave
}) => {
    const logoFileRef = useRef<HTMLInputElement>(null);
    const watermarkFileRef = useRef<HTMLInputElement>(null);

    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [watermarkPreview, setWatermarkPreview] = useState<string | null>(null);
    const [newLogoFile, setNewLogoFile] = useState<File | null>(null);
    const [newWatermarkFile, setNewWatermarkFile] = useState<File | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isValid, isDirty },
        reset,
        watch,
    } = useForm<Company>({
        defaultValues: company || {
            legal_name: "",
            document_type: "",
            document_number: "",
            phone: "",
            email: "",
            address: "",
            country: "",
            city: "",
            logo: "",
            watermark: "",
        },
        mode: "onChange",
    });

    const logoValue = watch("logo");
    const watermarkValue = watch("watermark");

    useEffect(() => {
        if (company) {
            reset(company);

            if (company.logo) {
                loadImagePreview(company.logo, "logo");
            }
            if (company.watermark) {
                loadImagePreview(company.watermark, "watermark");
            }
        } else {
            // Reset form if creating new
            reset({
                legal_name: "",
                document_type: "",
                document_number: "",
                phone: "",
                email: "",
                address: "",
                country: "",
                city: "",
                logo: "",
                watermark: "",
            });
            setLogoPreview(null);
            setWatermarkPreview(null);
            setNewLogoFile(null);
            setNewWatermarkFile(null);
        }
    }, [company, reset]);

    useEffect(() => {
        if (logoValue && !newLogoFile) {
            loadImagePreview(logoValue, "logo");
        }
    }, [logoValue, newLogoFile]);

    useEffect(() => {
        if (watermarkValue && !newWatermarkFile) {
            loadImagePreview(watermarkValue, "watermark");
        }
    }, [watermarkValue, newWatermarkFile]);

    const loadImagePreview = async (
        imagePath: string,
        type: "logo" | "watermark"
    ) => {
        try {
            // @ts-ignore
            if (typeof getUrlImage === "function") {
                // @ts-ignore
                const imageUrl = await getUrlImage(
                    imagePath.replaceAll("\\", "/"),
                    true
                );
                if (type === "logo") {
                    setLogoPreview(imageUrl);
                } else {
                    setWatermarkPreview(imageUrl);
                }
            } else {
                const baseUrl = "https://dev.monaros.co";
                const imageUrl = `${baseUrl}/storage/${imagePath.replaceAll(
                    "\\",
                    "/"
                )}`;
                if (type === "logo") {
                    setLogoPreview(imageUrl);
                } else {
                    setWatermarkPreview(imageUrl);
                }
            }
        } catch (error) {
            console.error(`Error loading ${type} preview:`, error);
        }
    };

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewLogoFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setNewLogoFile(null);
            if (logoValue) {
                loadImagePreview(logoValue, "logo");
            } else {
                setLogoPreview(null);
            }
        }
    };

    const handleWatermarkChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (file) {
            setNewWatermarkFile(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                setWatermarkPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setNewWatermarkFile(null);
            if (watermarkValue) {
                loadImagePreview(watermarkValue, "watermark");
            } else {
                setWatermarkPreview(null);
            }
        }
    };

    const removeLogo = () => {
        setNewLogoFile(null);
        setLogoPreview(null);
        if (logoFileRef.current) {
            logoFileRef.current.value = "";
        }
    };

    const removeWatermark = () => {
        setNewWatermarkFile(null);
        setWatermarkPreview(null);
        if (watermarkFileRef.current) {
            watermarkFileRef.current.value = "";
        }
    };

    const documentTypes = [
        { label: "Rnc", value: "RNC" },
        { label: "Cedula De Entidad", value: "CC" },
        { label: "Pasaporte", value: "PASSPORT" },
    ];

    const countries = [
        { label: "República Dominicana", value: "RD" },
        { label: "Colombia", value: "CO" },
        { label: "México", value: "MX" },
        { label: "Argentina", value: "AR" },
        { label: "Chile", value: "CL" },
        { label: "Perú", value: "PE" },
    ];

    const onSubmit = (data: Company) => {
        onSave(data, newLogoFile || undefined, newWatermarkFile || undefined);
    };

    return (
        <div className="container-fluid">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row mb-4">
                    <div className="col-12">
                        <h5 className="fw-bold">Datos Consultorio</h5>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="legal_name" className="form-label">
                            Nombre Comercial <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="legal_name"
                            control={control}
                            rules={{
                                required: "El nombre del Consultorio no puede estar vacío",
                            }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="legal_name"
                                    className={`form-control ${errors.legal_name ? "is-invalid" : ""
                                        }`}
                                    placeholder="Nombre Consultorio"
                                />
                            )}
                        />
                        {errors.legal_name && (
                            <div className="invalid-feedback d-block">
                                {errors.legal_name.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="address" className="form-label">
                            Dirección <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="address"
                            control={control}
                            rules={{ required: "Ingrese una dirección válida" }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="address"
                                    className={`form-control ${errors.address ? "is-invalid" : ""
                                        }`}
                                    placeholder="Ej: Calle 123 #45-67, Bogotá"
                                />
                            )}
                        />
                        {errors.address && (
                            <div className="invalid-feedback d-block">
                                {errors.address.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="document_type" className="form-label">
                            Tipo Documento <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="document_type"
                            control={control}
                            rules={{ required: "Seleccione un Tipo de Documento" }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    id="document_type"
                                    options={documentTypes}
                                    placeholder="Seleccione un tipo de documento"
                                    className={`w-100 ${errors.document_type ? "is-invalid" : ""
                                        }`}
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
                            Documento <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="document_number"
                            control={control}
                            rules={{ required: "El Documento no puede estar vacío" }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="document_number"
                                    className={`form-control ${errors.document_number ? "is-invalid" : ""
                                        }`}
                                    placeholder="123456789"
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

                <div className="row mb-4">
                    <div className="col-12">
                        <h5 className="fw-bold">Configuración General</h5>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="phone" className="form-label">
                            WhatsApp <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="phone"
                            control={control}
                            rules={{
                                required: "Ingrese un número de WhatsApp válido",
                                pattern: {
                                    value: /^\+?[\d\s\-\(\)]+$/,
                                    message: "Formato de teléfono inválido",
                                },
                            }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="phone"
                                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                                    placeholder="+57 300 123 4567"
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
                            Correo Electrónico <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                                required: "Ingrese un correo electrónico válido",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Formato de email inválido",
                                },
                            }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="email"
                                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                    placeholder="ejemplo@correo.com"
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
                        <label htmlFor="country" className="form-label">
                            País <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="country"
                            control={control}
                            rules={{ required: "Seleccione un país" }}
                            render={({ field }) => (
                                <Dropdown
                                    {...field}
                                    id="country"
                                    options={countries}
                                    placeholder="Seleccione un país"
                                    className={`w-100 ${errors.country ? "is-invalid" : ""}`}
                                />
                            )}
                        />
                        {errors.country && (
                            <div className="invalid-feedback d-block">
                                {errors.country.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="city" className="form-label">
                            Ciudad <span className="text-danger">*</span>
                        </label>
                        <Controller
                            name="city"
                            control={control}
                            rules={{ required: "Ingrese una ciudad válida" }}
                            render={({ field }) => (
                                <InputText
                                    {...field}
                                    id="city"
                                    className={`form-control ${errors.city ? "is-invalid" : ""}`}
                                    placeholder="Ej: Medellín"
                                />
                            )}
                        />
                        {errors.city && (
                            <div className="invalid-feedback d-block">
                                {errors.city.message}
                            </div>
                        )}
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="logo" className="form-label">
                            Logo
                        </label>

                        {logoPreview && (
                            <div className="mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="img-thumbnail"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        className="p-button-danger p-button-sm"
                                        onClick={removeLogo}
                                        tooltip="Eliminar logo"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </Button>
                                </div>
                                <small className="text-muted">
                                    {newLogoFile ? "Nueva imagen seleccionada" : "Imagen actual"}
                                </small>
                            </div>
                        )}

                        <input
                            ref={logoFileRef}
                            type="file"
                            id="logo"
                            className="form-control"
                            accept="image/*"
                            onChange={handleLogoChange}
                        />
                        <small className="text-muted">
                            Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                        </small>
                    </div>

                    <div className="col-md-6 mb-3">
                        <label htmlFor="watermark" className="form-label">
                            Marca de Agua
                        </label>

                        {watermarkPreview && (
                            <div className="mb-3">
                                <div className="d-flex align-items-center gap-3">
                                    <img
                                        src={watermarkPreview}
                                        alt="Watermark preview"
                                        className="img-thumbnail"
                                        style={{
                                            width: "200px",
                                            height: "200px",
                                            objectFit: "contain",
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        className="p-button-danger p-button-sm"
                                        onClick={removeWatermark}
                                        tooltip="Eliminar marca de agua"
                                    >
                                        {" "}
                                        <i className="fa-solid fa-trash"></i>{" "}
                                    </Button>
                                </div>
                                <small className="text-muted">
                                    {newWatermarkFile
                                        ? "Nueva imagen seleccionada"
                                        : "Imagen actual"}
                                </small>
                            </div>
                        )}

                        <input
                            ref={watermarkFileRef}
                            type="file"
                            id="watermark"
                            className="form-control"
                            accept="image/*"
                            onChange={handleWatermarkChange}
                        />
                        <small className="text-muted">
                            Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB
                        </small>
                    </div>
                </div>

                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <Button
                            type="submit"
                            label="Guardar Información"
                            icon="pi pi-save"
                            className="p-button-primary"
                        >
                            <i className="fas fa-save me-2"></i>
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};
