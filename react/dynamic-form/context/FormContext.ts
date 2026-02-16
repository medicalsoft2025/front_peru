import React, { createContext, useContext } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { FieldState } from "../interfaces/models";

export interface FormContextValue {
    fieldStates: Record<string, FieldState>;
    setFieldState: (fieldPath: string, state: Partial<FieldState>) => void;
    form: UseFormReturn<FieldValues>;
    onElementSelect?: (config: any) => void;
    sources?: Record<string, (params?: any) => Promise<any[]>>;
    fieldSuggestions?: Record<string, any[]>;
    setFieldSuggestions?: (suggestions: Record<string, any[]>) => void;
}

export const FormContext = createContext<FormContextValue | undefined>(
    undefined
);

export const useFormContext = () => {
    const context = useContext(FormContext);
    if (!context) {
        throw new Error("useFormContext must be used within FormProvider");
    }
    return context;
};
