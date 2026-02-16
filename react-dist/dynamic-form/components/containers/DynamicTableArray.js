import React from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { FormProvider } from "../../providers/FormProvider.js";
import { DynamicFormContainer } from "./DynamicFormContainer.js";
import { useFieldConditions } from "../../hooks/useFieldConditions.js";
import { useFormContext } from "../../context/FormContext.js"; // Componente celda extraido para permitir el uso correcto de hooks
const DynamicTableArrayCell = ({
  colNode,
  rowData,
  fields,
  form,
  parentPath
}) => {
  // Calcular index real basado en el ID del field array
  const realIndex = fields.findIndex(f => f.id === rowData.id);

  // Hooks ahora se ejecutan incondicionalmente dentro del componente
  const {
    fieldStates
  } = useFieldConditions({
    config: colNode,
    form,
    basePath: `${parentPath}.${realIndex}`
    // Importante: pasar un key único o asegurar que basePath cambia
  });
  const parentContext = useFormContext();
  const mergedFieldStates = {
    ...parentContext.fieldStates,
    ...fieldStates
  };

  // Si no encontramos el index (e.g. durante borrado), retornar null o fallback
  if (realIndex === -1) return null;
  return /*#__PURE__*/React.createElement(FormProvider, {
    value: {
      fieldStates: mergedFieldStates,
      form: form,
      setFieldState: parentContext.setFieldState,
      onElementSelect: parentContext.onElementSelect,
      sources: parentContext.sources
    }
  }, /*#__PURE__*/React.createElement(DynamicFormContainer, {
    config: colNode,
    form: form,
    parentPath: `${parentPath}.${realIndex}`,
    className: "w-full"
  }));
};
export const DynamicTableArray = ({
  config,
  form,
  fields,
  append,
  remove,
  parentPath
}) => {
  const arrayConfig = config.arrayConfig || {};
  const tableConfig = arrayConfig.tableConfig || {};
  const getRealIndex = rowData => {
    return fields.findIndex(f => f.id === rowData.id);
  };
  const actionBodyTemplate = rowData => {
    const index = getRealIndex(rowData);
    return /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-trash me-1"
      }),
      className: "p-button-danger p-button-text p-button-sm",
      onClick: () => remove(index),
      type: "button",
      tooltip: arrayConfig.removeLabel || "Eliminar"
    });
  };
  const header = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-between align-items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl font-bold"
  }, config.label), /*#__PURE__*/React.createElement(Button, {
    label: arrayConfig.addLabel || "Agregar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus"
    }),
    onClick: () => append({}),
    type: "button",
    size: "small"
  }));

  // Wrapper para el body template que renderiza el componente Cell
  const cellBodyTemplate = colNode => rowData => {
    return /*#__PURE__*/React.createElement(DynamicTableArrayCell, {
      colNode: colNode,
      rowData: rowData,
      fields: fields,
      form: form,
      parentPath: parentPath
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: `dynamic-table-array mb-4 ${config.styleClass || ""}`
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: fields,
    header: header,
    showGridlines: tableConfig.showGridlines,
    stripedRows: tableConfig.stripedRows,
    size: "small",
    resizableColumns: tableConfig.resizableColumns,
    reorderableColumns: tableConfig.reorderableColumns,
    paginator: tableConfig.paginator,
    rows: tableConfig.rows || 5,
    tableStyle: {
      minWidth: '50rem'
    },
    emptyMessage: "No hay registros"
    // Importante: usar dataKey para estabilidad
    ,
    dataKey: "id"
  }, (config?.children || config?.containers)?.map((col, i) => {
    const key = col.name || `col-${i}`;
    const header = col.label || col.name || `Col ${i + 1}`;
    const fieldName = col.name;
    return /*#__PURE__*/React.createElement(Column, {
      key: key,
      header: header,
      body: cellBodyTemplate(col),
      style: {
        minWidth: '150px'
      },
      field: fieldName
    });
  }), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    exportable: false,
    style: {
      width: '4rem',
      textAlign: 'center'
    }
  })));
};