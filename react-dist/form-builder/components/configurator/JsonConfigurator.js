import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { TreeSelect } from "primereact/treeselect";
import { JsonHelpers } from "../../helpers/JsonHelpers.js";
import { InputTextarea } from "primereact/inputtextarea";
/**
 * Helper to get field properties considering rules
 */
const getComputedField = (field, allData, rootData, parentData) => {
  const effectiveField = JsonHelpers.getEffectiveField(field, allData, rootData, parentData);
  return {
    ...effectiveField,
    isVisible: effectiveField.visible !== false
  };
};
export const JsonConfigurator = ({
  data,
  metadata,
  onChange,
  treeOptions,
  parentData
}) => {
  const handleChange = (key, value) => {
    const newData = {
      ...data,
      [key]: value
    };
    onChange(newData);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column p-3"
  }, metadata.fields.map(field => /*#__PURE__*/React.createElement(ConfigFieldRenderer, {
    key: field.key,
    field: field,
    value: data ? data[field.key] : undefined,
    onChange: val => handleChange(field.key, val),
    allData: data,
    rootData: data // Top-level data is rootData
    ,
    parentData: parentData // External parent data
    ,
    treeOptions: treeOptions
  })));
};
const ConfigFieldRenderer = ({
  field,
  value,
  onChange,
  allData,
  rootData,
  parentData,
  treeOptions
}) => {
  const [error, setError] = useState(null);
  const computed = getComputedField(field, allData, rootData, parentData);
  if (!computed.isVisible) return null;
  const validate = val => {
    if (computed.required && (val === null || val === undefined || val === "")) {
      return "Requerido";
    }
    if (computed.validation?.pattern && typeof val === "string") {
      const regex = new RegExp(computed.validation.pattern);
      if (!regex.test(val)) {
        return computed.validation.errorMessage || "Formato inválido";
      }
    }
    return null;
  };
  const handleFieldChange = val => {
    const validationError = validate(val);
    setError(validationError);
    onChange(val);
  };
  const findNodeByKey = (nodes, key) => {
    if (!nodes) return undefined;
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return undefined;
  };
  const renderInput = () => {
    let inputType = computed.inputType;
    let currentField = computed;

    // Dynamic Input Type for Rule Value
    if (computed.key === "value") {
      if (allData?.source === "field") {
        inputType = "treeSelect";
        currentField = {
          ...computed,
          treeOptions: treeOptions
        };
      } else if (allData?.field && treeOptions) {
        const targetNode = findNodeByKey(treeOptions, allData.field);
        if (targetNode?.data?.inputType) {
          inputType = targetNode.data.inputType;
          if ((inputType === "select" || inputType === "radio") && targetNode.data.options) {
            currentField = {
              ...computed,
              options: targetNode.data.options
            };
          }
          if (["objectArray", "nestedObject", "file", "keyValueTable"].includes(inputType)) {
            inputType = "text";
          }
        }
      }
    }
    switch (inputType) {
      case "text":
        return /*#__PURE__*/React.createElement(InputText, {
          value: value || "",
          onChange: e => handleFieldChange(e.target.value),
          placeholder: currentField.placeholder,
          className: classNames({
            "p-invalid": !!error
          }, "w-100")
        });
      case "textarea":
        return /*#__PURE__*/React.createElement(InputTextarea, {
          value: value || "",
          onChange: e => handleFieldChange(e.target.value),
          placeholder: currentField.placeholder,
          className: classNames({
            "p-invalid": !!error
          }, "w-100")
        });
      case "number":
        return /*#__PURE__*/React.createElement(InputNumber, {
          value: value,
          onValueChange: e => handleFieldChange(e.value),
          min: currentField.min,
          max: currentField.max,
          suffix: currentField.suffix ? ` ${currentField.suffix}` : undefined,
          placeholder: currentField.placeholder,
          className: classNames({
            "p-invalid": !!error
          }, "w-100")
        });
      case "select":
        return /*#__PURE__*/React.createElement(Dropdown, {
          value: value,
          options: currentField.options,
          onChange: e => handleFieldChange(e.value),
          placeholder: currentField.placeholder || "Seleccionar",
          className: classNames({
            "p-invalid": !!error
          }, "w-100"),
          filter: true
        });
      case "checkbox":
        return /*#__PURE__*/React.createElement("div", {
          className: "d-flex align-items-center gap-2"
        }, /*#__PURE__*/React.createElement(Checkbox, {
          inputId: field.key,
          checked: !!value,
          onChange: e => handleFieldChange(e.checked)
        }), /*#__PURE__*/React.createElement("label", {
          htmlFor: field.key,
          className: "ml-2"
        }, computed.label));
      case "nestedObject":
        return /*#__PURE__*/React.createElement(NestedObjectManager, {
          field: computed,
          value: value || {},
          onChange: handleFieldChange,
          rootData: rootData,
          parentData: allData // Current element is the parent of the nested object
          ,
          treeOptions: treeOptions
        });
      case "keyValueTable":
      case "objectArray":
        return /*#__PURE__*/React.createElement(ArrayFieldManager, {
          field: computed,
          value: value || [],
          onChange: handleFieldChange,
          rootData: rootData,
          parentData: allData // Current element is the parent of the items in the array
          ,
          treeOptions: treeOptions
        });
      case "treeSelect":
        return /*#__PURE__*/React.createElement(TreeSelect, {
          value: value,
          options: treeOptions || field.treeOptions,
          onChange: e => handleFieldChange(e.value),
          placeholder: field.placeholder || "Seleccionar del árbol",
          className: classNames({
            "p-invalid": !!error
          }, "w-100"),
          filter: true,
          filterMode: "strict"
        });
      default:
        return /*#__PURE__*/React.createElement("div", null, "Unsupported type: ", computed.inputType);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "field mb-3"
  }, computed.inputType !== "checkbox" && /*#__PURE__*/React.createElement("label", {
    htmlFor: computed.key,
    className: "d-block mb-1 font-bold"
  }, computed.label, " ", computed.required && /*#__PURE__*/React.createElement("span", {
    className: "text-red-500"
  }, "*")), computed.description && /*#__PURE__*/React.createElement("small", {
    className: "d-block text-gray-500 mb-2"
  }, computed.description), renderInput(), error && /*#__PURE__*/React.createElement("small", {
    className: "text-red-500 block mt-1"
  }, error));
};
const NestedObjectManager = ({
  field,
  value,
  onChange,
  rootData,
  parentData,
  treeOptions
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const openEdit = () => {
    const currentItem = value ? {
      ...value
    } : {};
    if (field.fields) {
      field.fields.forEach(f => {
        if (currentItem[f.key] === undefined && f.defaultValue !== undefined) {
          currentItem[f.key] = f.defaultValue;
        }
      });
    }
    setEditingItem(currentItem);
    setDialogVisible(true);
  };
  const saveItem = () => {
    if (!editingItem) return;

    // Validation before saving - evaluating rules for each subfield
    if (field.fields) {
      for (const f of field.fields) {
        const computed = getComputedField(f, editingItem, rootData, parentData);
        if (computed.required && (editingItem[f.key] === undefined || editingItem[f.key] === null || editingItem[f.key] === "")) {
          // Could implement local error display here if needed
          return;
        }
      }
    }
    onChange(editingItem);
    setDialogVisible(false);
  };
  const dialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-1"
    }),
    onClick: () => setDialogVisible(false),
    className: "p-button-secondary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-check me-1"
    }),
    onClick: saveItem,
    autoFocus: true
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    label: `Configurar ${field.label}`,
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-cog me-1"
    }),
    onClick: openEdit,
    size: "small",
    className: "p-button-secondary"
  }), /*#__PURE__*/React.createElement(Dialog, {
    header: field.label,
    visible: dialogVisible,
    style: {
      width: '50vw'
    },
    footer: dialogFooter,
    onHide: () => setDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, editingItem && field.fields && field.fields.map(subField => /*#__PURE__*/React.createElement(ConfigFieldRenderer, {
    key: subField.key,
    field: subField,
    value: editingItem[subField.key],
    onChange: val => setEditingItem({
      ...editingItem,
      [subField.key]: val
    }),
    allData: editingItem,
    rootData: rootData,
    parentData: parentData,
    treeOptions: treeOptions
  })))));
};
const ArrayFieldManager = ({
  field,
  value,
  onChange,
  rootData,
  parentData,
  treeOptions
}) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(-1);
  const subFields = field.inputType === "keyValueTable" ? field.columns : field.fields;
  const openNew = () => {
    const newItem = {};
    if (subFields) {
      subFields.forEach(f => {
        const computed = getComputedField(f, {}, rootData, parentData);
        if (computed.defaultValue !== undefined) newItem[f.key] = computed.defaultValue;
      });
    }
    setEditingItem(newItem);
    setEditingIndex(-1);
    setDialogVisible(true);
  };
  const editItem = (item, index) => {
    setEditingItem({
      ...item
    });
    setEditingIndex(index);
    setDialogVisible(true);
  };
  const deleteItem = index => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };
  const saveItem = () => {
    if (!editingItem) return;
    if (subFields) {
      for (const f of subFields) {
        const computed = getComputedField(f, editingItem, rootData, parentData);
        if (computed.required && (editingItem[f.key] === undefined || editingItem[f.key] === null || editingItem[f.key] === "")) {
          return;
        }
      }
    }
    const newValue = [...value];
    if (editingIndex >= 0) {
      newValue[editingIndex] = editingItem;
    } else {
      newValue.push(editingItem);
    }
    onChange(newValue);
    setDialogVisible(false);
  };
  const dialogFooter = /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-end align-items-center gap-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: "Cancelar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-times me-1"
    }),
    onClick: () => setDialogVisible(false),
    className: "p-button-secondary"
  }), /*#__PURE__*/React.createElement(Button, {
    label: "Guardar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-check me-1"
    }),
    onClick: saveItem,
    autoFocus: true
  }));
  const actionBodyTemplate = (rowData, options) => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-pencil"
      }),
      className: "p-button-rounded p-button-text",
      onClick: () => editItem(rowData, options.rowIndex)
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-trash"
      }),
      className: "p-button-rounded p-button-text p-button-danger",
      onClick: () => deleteItem(options.rowIndex)
    }));
  };
  const columnBodyTemplate = (rowData, col) => {
    const val = rowData[col.key];
    if (val === null || val === undefined) return "";
    if (typeof val === 'object') {
      if (Array.isArray(val)) return `[Array: ${val.length}]`;
      return '[Object]';
    }
    if (typeof val === 'boolean') return val ? 'Si' : 'No';
    return val;
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mb-2"
  }, /*#__PURE__*/React.createElement(Button, {
    label: field.addButtonLabel || "Gestionar/Agregar",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-external-link me-1"
    }),
    onClick: openNew,
    size: "small",
    className: "p-button-secondary"
  })), value && value.length > 0 && /*#__PURE__*/React.createElement(DataTable, {
    value: value,
    size: "small",
    tableStyle: {
      minWidth: '100%'
    }
  }, subFields?.slice(0, 3).map(col => /*#__PURE__*/React.createElement(Column, {
    key: col.key,
    field: col.key,
    header: col.label,
    body: rowData => columnBodyTemplate(rowData, col)
  })), /*#__PURE__*/React.createElement(Column, {
    body: actionBodyTemplate,
    style: {
      width: '100px'
    }
  })), /*#__PURE__*/React.createElement(Dialog, {
    header: field.label,
    visible: dialogVisible,
    style: {
      width: '50vw'
    },
    footer: dialogFooter,
    onHide: () => setDialogVisible(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column"
  }, editingItem && subFields && subFields.map(subField => /*#__PURE__*/React.createElement(ConfigFieldRenderer, {
    key: subField.key,
    field: subField,
    value: editingItem[subField.key],
    onChange: val => setEditingItem({
      ...editingItem,
      [subField.key]: val
    }),
    allData: editingItem,
    rootData: rootData,
    treeOptions: treeOptions
  })))));
};