
import React from "react";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { useForm, Controller } from "react-hook-form";

interface TicketFormProps {
    visible: boolean;
    onHide: () => void;
    onSave: (data: any) => void;
}

interface TicketFormData {
    subject: string;
    stepsToReproduce: string;
    expectedResults: string;
    tags: any[];
    frequency: any;
    message: string;
    files: any;
}

export const TicketForm: React.FC<TicketFormProps> = ({ visible, onHide, onSave }) => {

    const defaultValues: TicketFormData = {
        subject: "",
        stepsToReproduce: "",
        expectedResults: "",
        tags: [],
        frequency: null,
        message: "",
        files: null
    };

    const { control, handleSubmit, reset, register } = useForm<TicketFormData>({
        defaultValues
    });

    const frequencyOptions = [
        { label: "Siempre", value: "always" },
        { label: "A veces", value: "sometimes" },
        { label: "Rara vez", value: "rarely" },
        { label: "Solo una vez", value: "once" }
    ];

    const tagOptions = [
        { label: "Error", value: "bug" },
        { label: "Mejora", value: "feature" },
        { label: "Pregunta", value: "question" },
        { label: "Diseño", value: "design" }
    ];

    const onSubmit = (data: TicketFormData) => {
        onSave(data);
        reset();
    };

    const handleHide = () => {
        reset();
        onHide();
    }

    const footer = (
        <div>
            <Button label="Cancelar" icon="pi pi-times" onClick={handleHide} className="p-button-text" />
            <Button label="Guardar" icon="pi pi-check" onClick={handleSubmit(onSubmit)} autoFocus />
        </div>
    );

    return (
        <Dialog
            header="Crear Ticket"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={handleHide}
            footer={footer}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="container-fluid">
                <div className="row">
                    <div className="col-12 mb-3">
                        <label htmlFor="subject" className="form-label">Asunto</label>
                        <Controller
                            name="subject"
                            control={control}
                            rules={{ required: 'El asunto es obligatorio' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <InputText
                                        id="subject"
                                        {...field}
                                        className={`w-100 ${fieldState.invalid ? 'p-invalid' : ''}`}
                                    />
                                    {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                                </>
                            )}
                        />
                    </div>

                    <div className="col-12 mb-3">
                        <label htmlFor="stepsToReproduce" className="form-label">Pasos para reproducir</label>
                        <Controller
                            name="stepsToReproduce"
                            control={control}
                            render={({ field }) => (
                                <InputTextarea
                                    id="stepsToReproduce"
                                    {...field}
                                    rows={3}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-12 mb-3">
                        <label htmlFor="expectedResults" className="form-label">Resultados esperados</label>
                        <Controller
                            name="expectedResults"
                            control={control}
                            render={({ field }) => (
                                <InputTextarea
                                    id="expectedResults"
                                    {...field}
                                    rows={3}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="tags" className="form-label">Etiquetas</label>
                        <Controller
                            name="tags"
                            control={control}
                            render={({ field }) => (
                                <MultiSelect
                                    id="tags"
                                    value={field.value}
                                    options={tagOptions}
                                    onChange={(e) => field.onChange(e.value)}
                                    placeholder="Selecciona etiquetas"
                                    display="chip"
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-md-6 col-12 mb-3">
                        <label htmlFor="frequency" className="form-label">Frecuencia</label>
                        <Controller
                            name="frequency"
                            control={control}
                            render={({ field }) => (
                                <Dropdown
                                    id="frequency"
                                    value={field.value}
                                    options={frequencyOptions}
                                    onChange={(e) => field.onChange(e.value)}
                                    placeholder="Selecciona frecuencia"
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-12 mb-3">
                        <label htmlFor="message" className="form-label">Mensaje</label>
                        <Controller
                            name="message"
                            control={control}
                            render={({ field }) => (
                                <InputTextarea
                                    id="message"
                                    {...field}
                                    rows={5}
                                    className="w-100"
                                />
                            )}
                        />
                    </div>

                    <div className="col-12 mb-3">
                        <label htmlFor="attachments" className="form-label">Adjuntar archivos</label>
                        <input className="form-control" type="file" id="attachments" multiple {...register("files")} />
                    </div>
                </div>
            </form>
        </Dialog>
    );
};
