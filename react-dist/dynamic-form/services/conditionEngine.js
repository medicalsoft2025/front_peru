export class ConditionEngine {
  constructor(formValues, fieldPathMapOrResolver = new Map()) {
    this.formValues = formValues;
    if (typeof fieldPathMapOrResolver === "function") {
      this.pathResolver = fieldPathMapOrResolver;
    } else {
      this.pathResolver = key => fieldPathMapOrResolver.get(key) || key;
    }
  }
  evaluateCondition(condition) {
    if (condition.conditions) {
      const results = condition.conditions.map(c => this.evaluateCondition(c));
      return condition.logicalOperator === "AND" ? results.every(Boolean) : results.some(Boolean);
    }
    const fieldValue = this.getFieldValue(condition.field, condition.operator);
    let targetValue = condition.value;
    if (condition.source === "field") {
      // If comparing against another field, resolve its value
      // We pass null operator because usually we want the raw value of the target field
      // However, if the target is an array wildcard, should we aggregate?
      // For now, assume simple value resolution or matching structure.
      targetValue = this.getFieldValue(condition.value);
    }
    switch (condition.operator) {
      case "equals":
        return fieldValue === targetValue;
      case "notEquals":
        return fieldValue !== targetValue;
      case "greaterThan":
        return fieldValue > targetValue;
      case "lessThan":
        return fieldValue < targetValue;
      case "contains":
        return Array.isArray(fieldValue) ? fieldValue.includes(targetValue) : String(fieldValue).includes(String(targetValue));
      case "isEmpty":
        return !fieldValue || Array.isArray(fieldValue) && fieldValue.length === 0 || typeof fieldValue === "string" && fieldValue.trim() === "";
      case "isNotEmpty":
        return !!fieldValue && (!Array.isArray(fieldValue) || fieldValue.length > 0) && (typeof fieldValue !== "string" || fieldValue.trim() !== "");
      case "sumGreaterThan":
        {
          const vals = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
          const sum = vals.reduce((a, b) => Number(a || 0) + Number(b || 0), 0);
          return sum > Number(targetValue);
        }
      case "sumLessThan":
        {
          const vals = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
          const sum = vals.reduce((a, b) => Number(a || 0) + Number(b || 0), 0);
          return sum < Number(targetValue);
        }
      case "sumEquals":
        {
          const vals = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
          const sum = vals.reduce((a, b) => Number(a || 0) + Number(b || 0), 0);
          return sum === Number(targetValue);
        }
      case "anyEquals":
        return (Array.isArray(fieldValue) ? fieldValue : [fieldValue]).some(v => v == targetValue);
      case "allEquals":
        return (Array.isArray(fieldValue) ? fieldValue : [fieldValue]).every(v => v == targetValue);
      default:
        return false;
    }
  }
  evaluateExpression(expression) {
    const interpolated = expression.replace(/\{\{([^}]+)\}\}/g, (match, fieldName) => {
      return this.getFieldValue(fieldName.trim()) || "";
    });
    try {
      if (interpolated.includes("+") || interpolated.includes("-") || interpolated.includes("*") || interpolated.includes("/")) {
        const safeExpression = interpolated.replace(/[^0-9+\-*/(). ]/g, "");
        return Function(`"use strict"; return (${safeExpression})`)();
      }
      return interpolated;
    } catch {
      return interpolated;
    }
  }
  getFieldValue(fieldKey, operator) {
    const fullPath = this.pathResolver(fieldKey, operator);
    const getValueRecursive = (obj, pathParts) => {
      if (obj === undefined || obj === null) return undefined;
      if (pathParts.length === 0) return obj;
      const [head, ...tail] = pathParts;
      if (head === "*") {
        if (Array.isArray(obj)) {
          // Flatten if result is array of arrays? 
          // Typically mapping over array returns array of values.
          // If deeper parts also have *, we get array of arrays.
          // For simple sum/any, we want a flat list of values?
          // Let's assume one level of wildcard for now or flat map.
          const results = obj.map(item => getValueRecursive(item, tail));
          // Flatten one level to support nested arrays if needed, but risky.
          return results.flat();
        }
        return [];
      }
      return getValueRecursive(obj[head], tail);
    };
    return getValueRecursive(this.formValues, fullPath.split("."));
  }
}