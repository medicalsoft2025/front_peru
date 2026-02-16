import React from "react";
import { TabPanel, TabView } from "primereact/tabview";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { DynamicFormElementConfig } from "../../interfaces/models";
import { UseFormReturn } from "react-hook-form";
import { FieldValues } from "react-hook-form";
import { useContainerErrors } from "../../hooks/useContainerErrors";

interface DynamicTabsProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    form: UseFormReturn<T>;
    loading?: boolean;
    onSubmit?: () => void;
    actualFormGroup?: string;
    className?: string;
}

const TabHeader = ({ label, hasError }: { label: string; hasError: boolean }) => (
    <div className="d-flex align-items-center gap-2">
        {hasError && <i className="fa-solid fa-exclamation-circle text-danger" />}
        <span className={hasError ? "text-danger" : ""}>{label}</span>
    </div>
);

export const DynamicTabs = <T extends FieldValues>(
    props: DynamicTabsProps<T>
) => {
    const { config, form, loading, onSubmit, actualFormGroup } = props;

    const activeTab = config.defaultActiveChildren
        ? Number(config.defaultActiveChildren)
        : 0;

    const TabWithErrorCheck = ({ tab, parentPath }: { tab: DynamicFormElementConfig; parentPath?: string }) => {
        const { hasErrors } = useContainerErrors({ config: tab, parentPath });
        return <TabHeader label={tab.label || tab.name || "Tab"} hasError={hasErrors} />;
    };

    return (
        <TabView activeIndex={activeTab} renderActiveOnly={false}>
            {(config.children || config.containers)?.map((tab, index) => (
                <TabPanel key={index} header={<TabWithErrorCheck tab={tab} parentPath={actualFormGroup} />}>
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
                </TabPanel>
            ))}
        </TabView>
    );
};
