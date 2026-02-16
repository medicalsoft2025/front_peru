import React from "react"
import { IntegrationConfigFormProps } from "../interfaces";
import { DynamicIntegrationForm } from "./DynamicIntegrationForm";

export const IntegrationConfig = (props: IntegrationConfigFormProps) => {


    
    const { configs = [], configFields, onSubmit } = props;

    const handleSubmit = (data: any) => {
        onSubmit?.(data);
    };

    return (
        <>
            <DynamicIntegrationForm
                configs={configs}
                initialConfigFields={configFields}
                onSubmit={handleSubmit}
            />
        </>
    );
};
