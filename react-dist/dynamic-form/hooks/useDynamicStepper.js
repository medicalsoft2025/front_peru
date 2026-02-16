import { useState } from "react";
import { useContainerErrors } from "./useContainerErrors.js";
export function useDynamicStepper({
  config,
  form,
  parentPath = ""
}) {
  const [stepActiveIndex, setStepActiveIndex] = useState(config.defaultActiveChildren ? Number(config.defaultActiveChildren) : 0);
  const currentStepConfig = (config.children || config.containers)?.[stepActiveIndex] || {
    name: 'dummy',
    type: 'container'
  };
  const {
    hasErrors
  } = useContainerErrors({
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
    validStep
  };
}