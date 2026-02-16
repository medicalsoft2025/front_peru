import React, { useState, useRef, useEffect } from "react";
import { JsonConfigMetadata, ConfigField } from "../../interfaces/configurator-models";
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
import { JsonHelpers } from "../../helpers/JsonHelpers";
import { InputTextarea } from "primereact/inputtextarea";

interface JsonConfiguratorProps {
    data: any;
    metadata: JsonConfigMetadata;
    onChange: (newData: any) => void;
    treeOptions?: any[];
    parentData?: any;
}

/**
 * Helper to get field properties considering rules
 */
const getComputedField = (field: ConfigField, allData: any, rootData: any, parentData: any): ConfigField & { isVisible: boolean } => {
    const effectiveField = JsonHelpers.getEffectiveField(field, allData, rootData, parentData);
    return {
        ...effectiveField,
        isVisible: effectiveField.visible !== false
    };
};

export const JsonConfigurator: React.FC<JsonConfiguratorProps> = ({ data, metadata, onChange, treeOptions, parentData }) => {
    const handleChange = (key: string, value: any) => {
        const newData = { ...data, [key]: value };
        onChange(newData);
    };

    return (
        <div className="d-flex flex-column p-3">
            {metadata.fields.map((field) => (
                <ConfigFieldRenderer
                    key={field.key}
                    field={field}
                    value={data ? data[field.key] : undefined}
                    onChange={(val) => handleChange(field.key, val)}
                    allData={data}
                    rootData={data} // Top-level data is rootData
                    parentData={parentData} // External parent data
                    treeOptions={treeOptions}
                />
            ))}
        </div>
    );
};

const ConfigFieldRenderer = ({
    field,
    value,
    onChange,
    allData,
    rootData,
    parentData,
    treeOptions
}: {
    field: ConfigField;
    value: any;
    onChange: (val: any) => void;
    allData?: any;
    rootData?: any;
    parentData?: any;
    treeOptions?: any[];
}) => {
    const [error, setError] = useState<string | null>(null);

    const computed = getComputedField(field, allData, rootData, parentData);
    if (!computed.isVisible) return null;

    const validate = (val: any) => {
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

    const handleFieldChange = (val: any) => {
        const validationError = validate(val);
        setError(validationError);
        onChange(val);
    };

    const findNodeByKey = (nodes: any[], key: string): any | undefined => {
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
                currentField = { ...computed, treeOptions: treeOptions };
            }
            else if (allData?.field && treeOptions) {
                const targetNode = findNodeByKey(treeOptions, allData.field);
                if (targetNode?.data?.inputType) {
                    inputType = targetNode.data.inputType;
                    if ((inputType === "select" || inputType === "radio") && targetNode.data.options) {
                        currentField = { ...computed, options: targetNode.data.options };
                    }
                    if (["objectArray", "nestedObject", "file", "keyValueTable"].includes(inputType)) {
                        inputType = "text";
                    }
                }
            }
        }

        switch (inputType) {
            case "text":
                return (
                    <InputText
                        value={value || ""}
                        onChange={(e) => handleFieldChange(e.target.value)}
                        placeholder={currentField.placeholder}
                        className={classNames({ "p-invalid": !!error }, "w-100")}
                    />
                );
            case "textarea":
                return (
                    <InputTextarea
                        value={value || ""}
                        onChange={(e) => handleFieldChange(e.target.value)}
                        placeholder={currentField.placeholder}
                        className={classNames({ "p-invalid": !!error }, "w-100")}
                    />
                );
            case "number":
                return (
                    <InputNumber
                        value={value}
                        onValueChange={(e) => handleFieldChange(e.value)}
                        min={currentField.min}
                        max={currentField.max}
                        suffix={currentField.suffix ? ` ${currentField.suffix}` : undefined}
                        placeholder={currentField.placeholder}
                        className={classNames({ "p-invalid": !!error }, "w-100")}
                    />
                );
            case "select":
                return (
                    <Dropdown
                        value={value}
                        options={currentField.options}
                        onChange={(e) => handleFieldChange(e.value)}
                        placeholder={currentField.placeholder || "Seleccionar"}
                        className={classNames({ "p-invalid": !!error }, "w-100")}
                        filter
                    />
                );
            case "checkbox":
                return (
                    <div className="d-flex align-items-center gap-2">
                        <Checkbox
                            inputId={field.key}
                            checked={!!value}
                            onChange={(e) => handleFieldChange(e.checked)}
                        />
                        <label htmlFor={field.key} className="ml-2">{computed.label}</label>
                    </div>
                );
            case "nestedObject":
                return (
                    <NestedObjectManager
                        field={computed}
                        value={value || {}}
                        onChange={handleFieldChange}
                        rootData={rootData}
                        parentData={allData} // Current element is the parent of the nested object
                        treeOptions={treeOptions}
                    />
                );
            case "keyValueTable":
            case "objectArray":
                return (
                    <ArrayFieldManager
                        field={computed}
                        value={value || []}
                        onChange={handleFieldChange}
                        rootData={rootData}
                        parentData={allData} // Current element is the parent of the items in the array
                        treeOptions={treeOptions}
                    />
                );
            case "treeSelect":
                return (
                    <TreeSelect
                        value={value}
                        options={treeOptions || field.treeOptions}
                        onChange={(e) => handleFieldChange(e.value)}
                        placeholder={field.placeholder || "Seleccionar del árbol"}
                        className={classNames({ "p-invalid": !!error }, "w-100")}
                        filter
                        filterMode="strict"
                    />
                );
            default:
                return <div>Unsupported type: {computed.inputType}</div>;
        }
    };

    return (
        <div className="field mb-3">
            {computed.inputType !== "checkbox" && (
                <label htmlFor={computed.key} className="d-block mb-1 font-bold">
                    {computed.label} {computed.required && <span className="text-red-500">*</span>}
                </label>
            )}
            {computed.description && <small className="d-block text-gray-500 mb-2">{computed.description}</small>}
            {renderInput()}
            {error && <small className="text-red-500 block mt-1">{error}</small>}
        </div>
    );
};

const NestedObjectManager = ({
    field,
    value,
    onChange,
    rootData,
    parentData,
    treeOptions
}: {
    field: ConfigField;
    value: any;
    onChange: (val: any) => void;
    rootData?: any;
    parentData?: any;
    treeOptions?: any[];
}) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    const openEdit = () => {
        const currentItem = value ? { ...value } : {};
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

    const dialogFooter = (
        <div className="d-flex justify-content-end align-items-center gap-2">
            <Button label="Cancelar" icon={<i className="fa fa-times me-1"></i>} onClick={() => setDialogVisible(false)} className="p-button-secondary" />
            <Button label="Guardar" icon={<i className="fa fa-check me-1"></i>} onClick={saveItem} autoFocus />
        </div>
    );

    return (
        <div>
            <Button label={`Configurar ${field.label}`} icon={<i className="fa fa-cog me-1"></i>} onClick={openEdit} size="small" className="p-button-secondary" />
            <Dialog
                header={field.label}
                visible={dialogVisible}
                style={{ width: '50vw' }}
                footer={dialogFooter}
                onHide={() => setDialogVisible(false)}
            >
                <div className="d-flex flex-column">
                    {editingItem && field.fields && field.fields.map(subField => (
                        <ConfigFieldRenderer
                            key={subField.key}
                            field={subField}
                            value={editingItem[subField.key]}
                            onChange={(val) => setEditingItem({ ...editingItem, [subField.key]: val })}
                            allData={editingItem}
                            rootData={rootData}
                            parentData={parentData}
                            treeOptions={treeOptions}
                        />
                    ))}
                </div>
            </Dialog>
        </div>
    );
};

const ArrayFieldManager = ({
    field,
    value,
    onChange,
    rootData,
    parentData,
    treeOptions
}: {
    field: ConfigField;
    value: any[];
    onChange: (val: any[]) => void;
    rootData?: any;
    parentData?: any;
    treeOptions?: any[];
}) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editingIndex, setEditingIndex] = useState<number>(-1);

    const subFields = field.inputType === "keyValueTable" ? field.columns : field.fields;

    const openNew = () => {
        const newItem: any = {};
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

    const editItem = (item: any, index: number) => {
        setEditingItem({ ...item });
        setEditingIndex(index);
        setDialogVisible(true);
    };

    const deleteItem = (index: number) => {
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

    const dialogFooter = (
        <div className="d-flex justify-content-end align-items-center gap-2">
            <Button label="Cancelar" icon={<i className="fa fa-times me-1"></i>} onClick={() => setDialogVisible(false)} className="p-button-secondary" />
            <Button label="Guardar" icon={<i className="fa fa-check me-1"></i>} onClick={saveItem} autoFocus />
        </div>
    );

    const actionBodyTemplate = (rowData: any, options: { rowIndex: number }) => {
        return (
            <div className="d-flex gap-2">
                <Button icon={<i className="fa fa-pencil"></i>} className="p-button-rounded p-button-text" onClick={() => editItem(rowData, options.rowIndex)} />
                <Button icon={<i className="fa fa-trash"></i>} className="p-button-rounded p-button-text p-button-danger" onClick={() => deleteItem(options.rowIndex)} />
            </div>
        );
    };

    const columnBodyTemplate = (rowData: any, col: ConfigField) => {
        const val = rowData[col.key];
        if (val === null || val === undefined) return "";
        if (typeof val === 'object') {
            if (Array.isArray(val)) return `[Array: ${val.length}]`;
            return '[Object]';
        }
        if (typeof val === 'boolean') return val ? 'Si' : 'No';
        return val;
    };

    return (
        <div>
            <div className="mb-2">
                <Button label={field.addButtonLabel || "Gestionar/Agregar"} icon={<i className="fa fa-external-link me-1"></i>} onClick={openNew} size="small" className="p-button-secondary" />
            </div>

            {value && value.length > 0 && (
                <DataTable value={value} size="small" tableStyle={{ minWidth: '100%' }}>
                    {subFields?.slice(0, 3).map(col => (
                        <Column
                            key={col.key}
                            field={col.key}
                            header={col.label}
                            body={(rowData) => columnBodyTemplate(rowData, col)}
                        />
                    ))}
                    <Column body={actionBodyTemplate} style={{ width: '100px' }} />
                </DataTable>
            )}

            <Dialog
                header={field.label}
                visible={dialogVisible}
                style={{ width: '50vw' }}
                footer={dialogFooter}
                onHide={() => setDialogVisible(false)}
            >
                <div className="d-flex flex-column">
                    {editingItem && subFields && subFields.map(subField => (
                        <ConfigFieldRenderer
                            key={subField.key}
                            field={subField}
                            value={editingItem[subField.key]}
                            onChange={(val) => setEditingItem({ ...editingItem, [subField.key]: val })}
                            allData={editingItem}
                            rootData={rootData}
                            treeOptions={treeOptions}
                        />
                    ))}
                </div>
            </Dialog>
        </div>
    );
};
