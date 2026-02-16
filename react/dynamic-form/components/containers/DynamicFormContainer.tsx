import React from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { useDynamicFormContainer } from "../../hooks/useDynamicFormContainer";
import { DynamicField } from "../fields/DynamicField";
import { DynamicCard } from "./DynamicCard";
import { DynamicTabs } from "./DynamicTabs";
import { DynamicAccordion } from "./DynamicAccordion";
import { DynamicStepper } from "./DynamicStepper";
import { DynamicArrayContainer } from "./DynamicArrayContainer";
import { Divider } from "primereact/divider";
import { useFormContext } from "../../context/FormContext";
import { Button } from "primereact/button";
import { useContainerErrors } from "../../hooks/useContainerErrors";
import { VisibilityProvider, useVisibility } from "../../context/VisibilityContext";
import { DynamicFormElementConfig } from "../../interfaces/models";

interface DynamicFormContainerProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    form: UseFormReturn<T>;
    loading?: boolean;
    onSubmit?: () => void;
    parentPath?: string;
    className?: string;
    // onElementSelect removed
}

export const DynamicFormContainer = <T extends FieldValues>({
    config,
    form,
    loading,
    onSubmit,
    parentPath = "",
    className = "",
}: DynamicFormContainerProps<T>) => {
    const {
        actualFormGroup,
        containerType,
        hasFields,
        hasContainers,
        hasChildren,
        shouldRenderFields,
        shouldRenderChildren,
        shouldRenderDivider,
    } = useDynamicFormContainer({
        config,
        form,
        parentPath,
    });

    const { hasErrors } = useContainerErrors({
        config,
        parentPath,
    });

    const { fieldStates, onElementSelect } = useFormContext();

    const containerName = parentPath ? `${parentPath}.${config.name}` : config.name;

    const { isVisible: parentVisibility } = useVisibility();

    const isVisible = containerName && fieldStates[containerName]?.visible !== undefined
        ? fieldStates[containerName].visible
        : true;

    const actualVisibility = isVisible && parentVisibility;

    const handleContainerClick = (e: React.MouseEvent) => {
        if (onElementSelect) {
            // Check if click was on an interactive element
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('button, input, select, textarea, a, .p-checkbox, .p-radiobutton');

            if (isInteractive) {
                return;
            }

            e.stopPropagation();
            onElementSelect(config);
        }
    };

    const renderByType = () => {
        switch (containerType) {
            case "card":
                return (
                    <DynamicCard
                        config={config}
                        form={form}
                        actualFormGroup={actualFormGroup}
                    />
                );

            case "tabs":
                return (
                    <DynamicTabs
                        config={config}
                        form={form}
                        actualFormGroup={actualFormGroup}
                    />
                );

            case "accordion":
                return (
                    <DynamicAccordion
                        config={config}
                        form={form}
                        actualFormGroup={actualFormGroup}
                    />
                );

            case "stepper":
                return (
                    <DynamicStepper
                        config={config}
                        form={form}
                        loading={loading}
                        onSubmit={onSubmit}
                        actualFormGroup={actualFormGroup}
                    />
                );

            case "array":
                return (
                    <DynamicArrayContainer
                        config={config}
                        form={form}
                        parentPath={actualFormGroup}
                    />
                );

            default:
                return (
                    <>
                        {shouldRenderChildren && hasChildren && (
                            <>
                                {config.children!.map((child, index) => {
                                    const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(child.type);
                                    if (isContainer) {
                                        return (
                                            <DynamicFormContainer
                                                key={child.name || `container-${index}`}
                                                config={child}
                                                form={form}
                                                loading={loading}
                                                onSubmit={onSubmit}
                                                parentPath={actualFormGroup}
                                                className={child.styleClass}
                                            />
                                        );
                                    } else {
                                        return (
                                            <DynamicField
                                                key={child.name}
                                                field={child}
                                                form={form as UseFormReturn<FieldValues>}
                                                parentPath={actualFormGroup}
                                                className={child.styleClass}
                                            />
                                        );
                                    }
                                })}
                            </>
                        )}
                        {shouldRenderFields && !hasChildren && hasFields && (
                            <>
                                {config.fields!.map((field) => (
                                    <DynamicField
                                        key={field.name}
                                        field={field}
                                        form={
                                            form as UseFormReturn<FieldValues>
                                        }
                                        parentPath={actualFormGroup}
                                        className={field.styleClass}
                                    />
                                ))}
                            </>
                        )}
                        {hasContainers && !hasChildren &&
                            config.containers!.map((childConfig, index) => {
                                return (
                                    <DynamicFormContainer
                                        key={
                                            childConfig.name ||
                                            `container-${index}`
                                        }
                                        config={childConfig}
                                        form={form}
                                        loading={loading}
                                        onSubmit={onSubmit}
                                        parentPath={actualFormGroup}
                                        className={childConfig.styleClass}
                                    />
                                );
                            })}
                        {
                            config.hasSubmitButton && (<>
                                <div className="d-flex justify-content-end mt-3">
                                    <Button
                                        label={
                                            config.submitButtonLabel || "Enviar"
                                        }
                                        icon={
                                            <i
                                                className={`${config.submitButtonIcon ||
                                                    "fa fa-save"
                                                    } me-2`}
                                            ></i>
                                        }
                                        loadingIcon={
                                            <i className="fa fa-spinner fa-spin"></i>
                                        }
                                        loading={loading}
                                        onClick={onSubmit}
                                        type="button"
                                        disabled={hasErrors}
                                    />
                                </div>
                            </>)
                        }
                    </>
                );
        }
    };

    return (
        <VisibilityProvider isVisible={isVisible}>
            <div
                className={config.contentStyleClass}
                onClick={handleContainerClick}
                style={{
                    cursor: onElementSelect ? 'pointer' : 'default',
                    border: onElementSelect ? '1px dashed transparent' : 'none',
                    display: actualVisibility ? 'contents' : 'none'
                }}
            >
                {renderByType()}
            </div>
            {shouldRenderDivider && actualVisibility && <Divider className={className} />}
        </VisibilityProvider>
    );
};
