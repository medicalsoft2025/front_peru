import React from "react";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
import { useFieldConditions } from "../../hooks/useFieldConditions.js";
import { useFormContext } from "../../context/FormContext.js";
import { FormProvider } from "../../providers/FormProvider.js";
import { Column } from "primereact/column";
export const DynamicTableArrayRow = ({
  config,
  form,
  basePath
}) => {
  const {
    fieldStates
  } = useFieldConditions({
    config,
    form,
    basePath
  });
  const parentContext = useFormContext();
  const mergedFieldStates = {
    ...parentContext.fieldStates,
    ...fieldStates
  };
  const cellBodyTemplate = (colNode, index) => rowData => {
    return /*#__PURE__*/React.createElement(DynamicFormContainer, {
      config: colNode,
      form: form,
      parentPath: `${basePath}.${index}`,
      className: "w-full"
    });
  };
  console.log(config.containers);
  return /*#__PURE__*/React.createElement(FormProvider, {
    value: {
      fieldStates: mergedFieldStates,
      form: form,
      setFieldState: parentContext.setFieldState
    }
  }, config?.containers?.map((col, i) => {
    const key = col.name || `col-${i}`;
    const header = col.label || col.name || `Col ${i + 1}`;
    const fieldName = col.name;
    return /*#__PURE__*/React.createElement(Column, {
      key: key,
      header: header,
      body: cellBodyTemplate(col, i),
      style: {
        minWidth: '150px'
      },
      field: fieldName
    });
  }));
};