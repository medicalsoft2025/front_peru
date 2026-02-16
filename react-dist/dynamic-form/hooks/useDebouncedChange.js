import { useState, useEffect, useRef, useCallback } from "react";
export const useDebouncedChange = ({
  field,
  controllerField
}) => {
  const debounceTime = field.asyncValidation?.debounceTime ?? field.debounceTime ?? 0;
  const [value, setValue] = useState(controllerField.value);
  const debounceRef = useRef(null);
  useEffect(() => {
    setValue(controllerField.value);
  }, [controllerField.value]);
  const handleChange = useCallback(newValue => {
    setValue(newValue);
    if (debounceTime > 0) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        controllerField.onChange(newValue);
      }, debounceTime);
    } else {
      controllerField.onChange(newValue);
    }
  }, [controllerField, debounceTime]);
  return {
    value,
    onChange: handleChange
  };
};