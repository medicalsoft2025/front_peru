import React, { forwardRef, Ref, useEffect, useMemo, useState } from "react";
import { DynamicFormElementConfig } from "../interfaces/models";
import { DynamicFormContainer } from "./containers/DynamicFormContainer";
import { useDynamicForm } from "../hooks/useDynamicForm";
import { FieldValues, UseFormReturn, FormProvider as FormProviderRHF } from "react-hook-form";
import { useFieldConditions } from "../hooks/useFieldConditions";
import { FormContextValue } from "../context/FormContext";
import { FormProvider } from "../providers/FormProvider";
import { sources as sourcesConfig } from "../config/sources";

import { FieldState } from "../interfaces/models";
import { VoiceFormAssistant } from "./voice/VoiceFormAssistant";
import { AiProvider } from "../services/AiService";

interface DynamicFormProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    onSubmit: (data: T) => void;
    onIsInvalidChange?: (invalid: boolean) => void;
    data?: T | null;
    loading?: boolean;
    className?: string;
    onChange?: (data: T) => void;
    setFormInvalid?: (invalid: boolean) => void;
    executeFieldConditionsOnInit?: boolean;
    onElementSelect?: (config: DynamicFormElementConfig | any) => void;
    sources?: Record<string, (params?: any) => Promise<any[]>>;
    initialFieldStates?: Record<string, FieldState>;
    aiEndpoint?: string;
    aiApiKey?: string;
    aiProvider?: AiProvider;
    showVoiceAssistant?: boolean;
}

export interface DynamicFormRef {
    handleSubmit: () => Promise<void>;
}

export const DynamicForm = forwardRef(
    <T extends FieldValues>(
        props: DynamicFormProps<T>,
        ref: Ref<DynamicFormRef>
    ) => {
        const {
            config,
            data,
            onSubmit,
            onIsInvalidChange,
            loading,
            className = "",
            onChange,
            setFormInvalid,
            executeFieldConditionsOnInit = false,
            onElementSelect,
            sources: sourcesProp,
            initialFieldStates,
            aiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent',
            aiApiKey = 'AIzaSyB5QtuH4IebTsvq3fpN-82jhcarlB5WYh4',
            aiProvider = 'gemini',
            showVoiceAssistant = false,
        } = props;

        const sources = useMemo(() => {
            return {
                ...sourcesConfig,
                ...sourcesProp,
            }
        }, [sourcesProp]);

        const [fieldSuggestions, setFieldSuggestions] = useState<Record<string, any[]>>({});

        const { form, emitSubmitData } = useDynamicForm<T>({
            config,
            data,
            onSubmit,
            onChange,
            setFormInvalid,
            ref,
        });

        const { fieldStates } = useFieldConditions({
            config,
            form,
            executeOnInit: !data || executeFieldConditionsOnInit,
            initialFieldStates
        });

        const formContextValue = useMemo(
            () =>
            ({
                fieldStates,
                setFieldState: (fieldPath: string, state: Partial<any>) => {
                },
                form: form as UseFormReturn<FieldValues>,
                onElementSelect,
                sources,
                fieldSuggestions, // Add to context
                setFieldSuggestions // Add to context
            } as FormContextValue),
            [fieldStates, form, onElementSelect, sources, fieldSuggestions]
        );

        useEffect(() => {
            if (form.formState.isValid) {
                onIsInvalidChange?.(false);
            } else {
                onIsInvalidChange?.(true);
            }
        }, [form.formState.isValid]);

        return (
            <FormProviderRHF {...form}>
                <FormProvider value={formContextValue}>
                    <form className={className}>
                        {(config.children || config.containers)?.map((child, index) => (
                            <DynamicFormContainer
                                key={child.name || `element-${index}`}
                                config={child}
                                loading={loading}
                                onSubmit={emitSubmitData}
                                form={form}
                            />
                        ))}
                    </form>
                    {showVoiceAssistant && (
                        <VoiceFormAssistant
                            config={config}
                            aiEndpoint={aiEndpoint}
                            aiApiKey={aiApiKey}
                            aiProvider={aiProvider}
                        />
                    )}
                </FormProvider>
            </FormProviderRHF>
        );
    }
);
