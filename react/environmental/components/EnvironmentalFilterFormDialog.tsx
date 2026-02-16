import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { EnvironmentalFilterForm } from "./EnvironmentalFilterForm";
import { EnvironmentalCalendarFilterType } from "../interfaces/types";
import { useId } from "react";

interface EnvironmentalFilterFormDialogProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (data: any) => void;
    type: EnvironmentalCalendarFilterType;
    title?: string;
    loading?: boolean;
    initialValues?: any;
}

export const EnvironmentalFilterFormDialog = ({
    visible,
    onHide,
    onSubmit,
    type,
    title = "Nuevo Registro",
    loading = false,
    initialValues
}: EnvironmentalFilterFormDialogProps) => {

    const formId = useId();

    return (<>
        <Dialog
            visible={visible}
            onHide={onHide}
            header={title}
            style={{ width: '75vw' }}
            footer={<>
                <div className="d-flex justify-content-end align-items-center gap-2">
                    <Button
                        type="button"
                        label="Cancelar"
                        onClick={onHide}
                        severity="secondary"
                        icon={<i className="fa-solid fa-times me-1" />}
                    />
                    <Button
                        type="submit"
                        form={formId}
                        label="Guardar"
                        icon={<i className="fa fa-save me-1" />}
                        disabled={loading}
                    />
                </div>
            </>}
        >
            <EnvironmentalFilterForm formId={formId} onSubmit={onSubmit} type={type} initialValues={initialValues} />
        </Dialog>
    </>);
};