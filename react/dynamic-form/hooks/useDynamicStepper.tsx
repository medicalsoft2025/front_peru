import { useState } from "react";
import { UseFormReturn, FieldValues } from "react-hook-form";
import { DynamicFormContainerConfig } from "../interfaces/models";
import { useContainerErrors } from "./useContainerErrors";

interface UseDynamicStepperProps<T extends FieldValues> {
    config: DynamicFormContainerConfig;
    form: UseFormReturn<T>;
    parentPath?: string;
}

interface UseDynamicStepperReturn {
    stepActiveIndex: number;
    setStepActiveIndex: (index: number) => void;
    validStep: () => boolean;
}

export function useDynamicStepper<T extends FieldValues>({
    config,
    form,
    parentPath = "",
}: UseDynamicStepperProps<T>): UseDynamicStepperReturn {
    const [stepActiveIndex, setStepActiveIndex] = useState(
        config.defaultActiveChildren ? Number(config.defaultActiveChildren) : 0
    );

    const currentStepConfig = (config.children || config.containers)?.[stepActiveIndex] || { name: 'dummy', type: 'container' };
    const { hasErrors } = useContainerErrors({
        config: currentStepConfig,
        parentPath: parentPath
    });

    const validStep = () => {
        if (config.type !== "stepper") {
            return true;
        }
        return !hasErrors;
    };

    return {
        stepActiveIndex,
        setStepActiveIndex,
        validStep,
    };
}
