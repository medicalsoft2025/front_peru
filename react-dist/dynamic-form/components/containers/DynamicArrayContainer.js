import React, { useEffect } from "react";
import { useFieldArray } from "react-hook-form";
import { Button } from "primereact/button";
import { DynamicArrayItem } from "./DynamicArrayItem.js";
import { DynamicTableArray } from "./DynamicTableArray.js";
export const DynamicArrayContainer = ({
  config,
  form,
  parentPath = ""
}) => {
  const arrayName = parentPath ? `${parentPath}.${config.name}` : config.name;
  if (!arrayName) {
    console.error("DynamicArrayContainer: 'name' is required for array definitions.");
    return null;
  }
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control: form.control,
    name: arrayName
  });
  const {
    addLabel = "Agregar",
    removeLabel = "Eliminar",
    min = 0,
    max
  } = config.arrayConfig || {};
  useEffect(() => {
    if (config.initialValue && fields.length === 0) {
      if (fields.length < min) {
        const diff = min - fields.length;
        for (let i = 0; i < diff; i++) {
          append({});
        }
      }
    }
  }, [min, fields.length, append, config.initialValue]);
  if (config.arrayConfig?.format === "table") {
    return /*#__PURE__*/React.createElement(DynamicTableArray, {
      config: config,
      form: form,
      fields: fields,
      append: append,
      remove: remove,
      parentPath: arrayName
    });
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column gap-2 w-full"
  }, config.label && /*#__PURE__*/React.createElement("div", {
    className: "text-xl font-bold mb-2"
  }, config.label), fields.map((field, index) => /*#__PURE__*/React.createElement(DynamicArrayItem, {
    key: field.id,
    config: config,
    form: form,
    index: index,
    basePath: `${arrayName}.${index}`,
    onRemove: remove,
    removeLabel: removeLabel
  })), /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-start mt-2"
  }, /*#__PURE__*/React.createElement(Button, {
    type: "button",
    label: addLabel,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa-solid fa-plus me-1"
    }),
    onClick: () => append({}),
    disabled: max !== undefined && fields.length >= max
  })));
};