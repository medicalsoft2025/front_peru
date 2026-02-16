import React from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { DynamicFormContainerConfig } from "../../interfaces/models";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { UseFormReturn } from "react-hook-form";
import { FieldValues } from "react-hook-form";
import { useContainerErrors } from "../../hooks/useContainerErrors";
import { DynamicFormElementConfig } from "../../interfaces/models";

interface DynamicAccordionProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    form: UseFormReturn<T>;
    loading?: boolean;
    onSubmit?: () => void;
    actualFormGroup?: string;
}

const AccordionHeader = ({ label, hasError }: { label: string; hasError: boolean }) => (
    <div className="d-flex align-items-center gap-2">
        {hasError && <i className="fa-solid fa-exclamation-circle text-danger" />}
        <span className={hasError ? "text-danger" : ""}>{label}</span>
    </div>
);

export const DynamicAccordion = <T extends FieldValues>(
    props: DynamicAccordionProps<T>
) => {
    const { config, form, loading, onSubmit, actualFormGroup } = props;

    const activeIndex = config.defaultActiveChildren
        ? Number(config.defaultActiveChildren)
        : 0;

    const AccordionTabWithErrorCheck = ({ tab, parentPath }: { tab: DynamicFormElementConfig; parentPath?: string }) => {
        const { hasErrors } = useContainerErrors({ config: tab, parentPath });
        return <AccordionHeader label={tab.label || tab.name || "Sección"} hasError={hasErrors} />;
    };

    return (
        <Accordion activeIndex={activeIndex} multiple>
            {(config.children || config.containers)?.map((tab, index) => (
                <AccordionTab key={index} header={<AccordionTabWithErrorCheck tab={tab} parentPath={actualFormGroup} />}>
                    <div className={tab.contentStyleClass}>
                        <DynamicFormContainer
                            config={tab}
                            form={form}
                            loading={loading}
                            onSubmit={onSubmit}
                            parentPath={actualFormGroup}
                            className={tab.styleClass}
                        />
                    </div>
                </AccordionTab>
            ))}
        </Accordion>
    );
};
