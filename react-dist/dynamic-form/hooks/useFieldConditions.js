import { useEffect, useState, useCallback, useRef } from "react";
import { ConditionEngine } from "../services/conditionEngine.js";
export function useFieldConditions({
  config,
  form,
  // This is full form context
  executeOnInit = true,
  basePath = "",
  initialFieldStates = {}
}) {
  const {
    watch,
    setValue,
    getValues,
    setError,
    clearErrors
  } = form;
  const [fieldStates, setFieldStates] = useState(initialFieldStates);
  const timeoutRef = useRef(null);
  const fieldConfigs = useRef(new Map());
  const fieldPathMap = useRef(new Map());
  const allFields = useRef(new Set());
  const isInitialized = useRef(false);
  const collectFields = useCallback((container, parentPath = "") => {
    let currentPath = parentPath || basePath;
    if (container.type === "form" && container.name) {
      currentPath = currentPath ? `${currentPath}.${container.name}` : container.name;
    } else if (container.name && ["array", "objectArray"].includes(container.type || "")) {
      // Array containers create a wildcard scope
      currentPath = currentPath ? `${currentPath}.${container.name}.*` : `${container.name}.*`;
    } else if (container.name && container.type !== "array") {
      // Optional: append name for other containers if needed for targeting
    }
    const allElements = [...(container.children || []), ...(container.fields || []), ...(container.containers || [])];
    allElements.forEach(element => {
      const isContainer = ["card", "form", "tabs", "tab", "accordion", "stepper", "container", "array"].includes(element.type);
      if (isContainer) {
        collectFields(element, currentPath);
      } else {
        const fieldPath = currentPath ? `${currentPath}.${element.name}` : element.name || "";
        allFields.current.add(fieldPath);
        fieldPathMap.current.set(fieldPath, fieldPath);
        if (element.rules && element.rules.length > 0) {
          fieldConfigs.current.set(fieldPath, element);
        }
      }
    });
    if (container.name && container.rules && container.rules.length > 0) {
      let containerPath = currentPath;
      if (["array", "objectArray"].includes(container.type || "")) {
        containerPath = parentPath ? `${parentPath}.${container.name}` : container.name;
      } else if (container.type === "form") {
        // already set
      } else {
        containerPath = parentPath ? `${parentPath}.${container.name}` : container.name;
      }
      fieldConfigs.current.set(containerPath, container);
    }
  }, [basePath]);
  const extractFieldsFromCondition = useCallback(condition => {
    const fields = new Set();
    const extract = cond => {
      if (cond.conditions) {
        cond.conditions.forEach(extract);
      } else {
        fields.add(cond.field);

        // Add dependency if source is "field"
        if (cond.source === "field" && cond.value) {
          fields.add(cond.value);
        }
        if (cond.value && typeof cond.value === "string") {
          const matches = cond.value.match(/\{\{([^}]+)\}\}/g) || [];
          matches.forEach(match => {
            fields.add(match.replace(/\{\{|\}\}/g, "").trim());
          });
        }
      }
    };
    extract(condition);
    return Array.from(fields);
  }, []);
  const matchWildcardPath = (genericPath, specificPath) => {
    if (genericPath === specificPath) return true;
    const pattern = genericPath.replace(/\./g, "\\.").replace(/\*/g, "\\d+");
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(specificPath);
  };
  const getRowIndexFromPath = (genericPath, specificPath) => {
    const partsGen = genericPath.split(".");
    const partsSpec = specificPath.split(".");
    for (let i = 0; i < partsGen.length; i++) {
      if (partsGen[i] === "*" && /^\d+$/.test(partsSpec[i])) {
        return parseInt(partsSpec[i]);
      }
    }
    return null;
  };
  const resolvePathWithIndex = (genericPath, index) => {
    return genericPath.replace("*", index.toString());
  };
  const executeRulesForField = useCallback(changedFieldPath => {
    const values = getValues();
    const updates = {};
    fieldConfigs.current.forEach((fieldConfig, genericFieldPath) => {
      if (fieldConfig.rules && fieldConfig.rules.length > 0) {
        // Determine if this rule block is relevant to the changed field
        const isDefiningField = matchWildcardPath(genericFieldPath, changedFieldPath);
        let rowIndex = null;
        if (isDefiningField) {
          rowIndex = getRowIndexFromPath(genericFieldPath, changedFieldPath);
        }

        // Filter rules that depend on the changed field
        const relevantRules = fieldConfig.rules.filter(rule => {
          const conditionFields = extractFieldsFromCondition(Array.isArray(rule.condition) ? {
            conditions: rule.condition
          } : rule.condition);
          const dependsOnChanged = conditionFields.some(condField => {
            return matchWildcardPath(condField, changedFieldPath);
          });
          if (dependsOnChanged) {
            if (rowIndex === null) {
              const matchingCondField = conditionFields.find(f => matchWildcardPath(f, changedFieldPath));
              if (matchingCondField) {
                rowIndex = getRowIndexFromPath(matchingCondField, changedFieldPath);
              }
            }
            return true;
          }
          return false;
        });
        relevantRules.forEach(rule => {
          // Scope Resolution
          const targets = Array.isArray(rule.actions) ? rule.actions.map(a => a.target) : [rule.actions.target];
          const isArrayTarget = targets.some(t => t && t.includes("*"));
          let indicesToProcess = [];
          if (rowIndex !== null) {
            // Triggered by specific row -> process only that row
            indicesToProcess = [rowIndex];
          } else if (isArrayTarget) {
            // Triggered by external field -> process all rows if target is array
            const arrayPath = genericFieldPath.split(".*")[0];
            // Try to resolve array length from values
            // Use first wildcard-containing target to guess array path ?
            // Or simpler: usually genericFieldPath is defined inside array if it has *.
            // If genericFieldPath doesn't have *, but target DOES...
            const validTarget = targets.find(t => t && t.includes(".*"));
            if (validTarget) {
              const targetArrayPath = validTarget.split(".*")[0];
              const arrayData = targetArrayPath.split(".").reduce((obj, key) => obj && obj[key], values);
              if (Array.isArray(arrayData)) {
                indicesToProcess = arrayData.map((_, i) => i);
              }
            }
          } else {
            // Simple scalar validation
            indicesToProcess = [-1];
          }
          indicesToProcess.forEach(idx => {
            // Resolver to handle mixed scope (Global Aggregation vs Local Scalar)
            const pathResolver = (key, operator) => {
              // If aggregation operator, keep generic key to allow array processing
              if (operator && ["sumGreaterThan", "sumLessThan", "sumEquals", "anyEquals", "allEquals"].includes(operator)) {
                return key;
              }
              // If scalar operator and we have an index, scope the key
              if (idx !== -1 && key.includes("*")) {
                return resolvePathWithIndex(key, idx);
              }
              return key;
            };

            // Helper for target resolution (targets are always specific in this context)
            const toSpecific = p => idx !== -1 && p.includes("*") ? resolvePathWithIndex(p, idx) : p;
            const engine = new ConditionEngine(values, pathResolver);
            const conditionResult = Array.isArray(rule.condition) ? rule.condition.every(c => engine.evaluateCondition(c)) : engine.evaluateCondition(rule.condition);
            const actions = Array.isArray(rule.actions) ? rule.actions : [rule.actions];
            actions.forEach(action => {
              const specificTarget = toSpecific(action.target);
              switch (action.type) {
                case "show":
                case "hide":
                case "enable":
                case "disable":
                  const prop = action.type === "show" || action.type === "hide" ? "visible" : "disabled";
                  const val = action.type === "show" || action.type === "enable" ? conditionResult : !conditionResult;
                  updates[specificTarget] = {
                    ...updates[specificTarget],
                    [prop]: val
                  };
                  break;
                case "setValue":
                  if (conditionResult && action.target) {
                    const newValue = action.expression ? engine.evaluateExpression(action.expression) : action.value;
                    setValue(specificTarget, newValue, {
                      shouldValidate: true
                    });
                  }
                  break;
                case "validationError":
                  if (conditionResult) {
                    setError(specificTarget, {
                      type: "custom",
                      message: action.value || "Error de validación"
                    });
                  } else {
                    // Only clear if the current error is THIS specific error
                    const currentErrors = form.formState.errors;
                    // Access nested error object if path has dots, or use lodash get-like logic if needed. 
                    // Simplest is to check if we can access it directly or via path library.
                    // Assuming flat access or simple check for now.
                    // For dynamic paths 'a.b.c', errors is nested. 
                    // Using split/reduce to find error object.
                    const errorObj = specificTarget.split('.').reduce((obj, key) => obj && obj[key], currentErrors);
                    if (errorObj && errorObj.type === "custom" && (!action.value || errorObj.message === action.value)) {
                      clearErrors(specificTarget);
                    }
                  }
                  break;
              }
            });
          });
        });
      }
    });
    if (Object.keys(updates).length > 0) {
      setFieldStates(prev => {
        const newState = {
          ...prev
        };
        Object.entries(updates).forEach(([fieldPath, state]) => {
          newState[`${fieldPath}`] = {
            ...prev[`${fieldPath}`],
            ...state
          };
        });
        return newState;
      });
    }
  }, [getValues, setValue, extractFieldsFromCondition]);
  useEffect(() => {
    collectFields(config);
    isInitialized.current = false;
    if (executeOnInit) {
      const fieldsToExecute = Array.from(allFields.current);
      fieldsToExecute.forEach(fieldPath => {
        executeRulesForField(fieldPath);
      });
    }
    isInitialized.current = true;
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [config, collectFields, executeOnInit, executeRulesForField]);
  useEffect(() => {
    if (!isInitialized.current) return;
    const debouncedHandler = fieldName => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        if (fieldName) executeRulesForField(fieldName);
      }, 150);
    };
    const subscription = watch((value, {
      name
    }) => {
      if (name) {
        const fullPath = fieldPathMap.current.get(name) || name;
        debouncedHandler(fullPath);
      }
    });
    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [watch, executeRulesForField]);
  return {
    fieldStates
  };
}