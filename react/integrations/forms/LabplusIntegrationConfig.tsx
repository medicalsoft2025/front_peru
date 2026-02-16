import React from "react";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm";
import { IntegrationConfigFormProps } from "../interfaces";

export const LabplusIntegrationConfig = (props: IntegrationConfigFormProps) => {

    const { configs = [], onSubmit } = props;

    const initialConfigFields = [
        {
            field: "LABPLUS_URL",
            label: "URL",
            type: "text"
        },
        {
            field: "LABPLUS_TOKEN",
            label: "Token",
            type: "text"
        }
    ];

    const handleSubmit = (data: any) => {
        onSubmit?.(data);
    };

    return (
        <>
            <DynamicIntegrationForm
                configs={configs}
                initialConfigFields={initialConfigFields}
                onSubmit={handleSubmit}
            />
        </>
    );
};
