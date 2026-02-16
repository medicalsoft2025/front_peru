import React, { useCallback, useEffect, useState } from "react";
import { DynamicFieldConfig, DynamicFormContainerConfig, DynamicFormElementConfig } from "../../dynamic-form/interfaces/models";
import { AIFormGenerator } from "./AIFormGenerator";
import { DynamicForm } from "../../dynamic-form/components/DynamicForm";
import { Divider } from "primereact/divider";
import { Tree, TreeCheckboxSelectionKeys, TreeEventNodeEvent, TreeMultipleSelectionKeys, TreeSelectionEvent } from "primereact/tree";
import { JsonHelpers } from "../helpers/JsonHelpers";
import { JsonConfigurator } from "./configurator/JsonConfigurator";
import { finalNestedContainerConfigMetadata } from "../config/metadata";
import { copyJSONWithFeedback, showNotification } from "../../../services/utilidades";
import { InputText } from "primereact/inputtext";
import { TreeNode } from "primereact/treenode";
import { ContextMenu } from "primereact/contextmenu";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { FormBuilderData } from "../interfaces/types";
import { Controller, useForm, useWatch } from "react-hook-form";
import { SplitButton } from "primereact/splitbutton";

interface FormBuilderProps {
    onSubmit: (data: FormBuilderData) => void;
    initialData?: FormBuilderData | null;
    loading?: boolean;
}

export const FormBuilder = (props: FormBuilderProps) => {

    const { onSubmit, initialData, loading = false } = props;

    const { getValues, control, trigger, reset, formState: { errors, isValid } } = useForm<{ configName: string }>({
        defaultValues: initialData ?? {
            configName: ""
        }
    });

    const configName = useWatch({
        control,
        name: "configName"
    });

    const [baseConfig, setBaseConfig] = useState<DynamicFormElementConfig>({
        type: "container",
        children: [
            {
                name: "form",
                type: "form",
                label: "Formulario",
                children: []
            }
        ]
    });

    const [config, setConfigState] = useState<DynamicFormElementConfig>(baseConfig);
    const [past, setPast] = useState<DynamicFormElementConfig[]>([]);
    const [future, setFuture] = useState<DynamicFormElementConfig[]>([]);

    const [selectedConfig, setSelectedConfig] = useState<DynamicFormElementConfig | null>(null);
    const [parentConfig, setParentConfig] = useState<any>(null);
    const [selectedNodeKey, setSelectedNodeKey] = useState<string | TreeMultipleSelectionKeys | TreeCheckboxSelectionKeys | null>(null);

    const cm = React.useRef<ContextMenu>(null);
    const [rightClickedNode, setRightClickedNode] = useState<TreeNode | null>(null);

    const [elementsTree, setElementsTree] = useState<TreeNode[]>(JsonHelpers.convertConfigToElementsTree(config, "root"))

    const [importDialogVisible, setImportDialogVisible] = useState(false);
    const [importJson, setImportJson] = useState("");
    const [importErrors, setImportErrors] = useState<string[]>([]);

    const [isChangeInProgress, setIsChangeInProgress] = useState(false);
    const historyTimeoutRef = React.useRef<number | null>(null);

    const [aiGeneratorVisible, setAiGeneratorVisible] = useState(false);

    const setConfig = (newConfig: DynamicFormElementConfig, pushToHistory = true) => {
        if (pushToHistory) {
            // Reset debounced history
            if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
            setIsChangeInProgress(false);

            setPast([...past, JSON.parse(JSON.stringify(config))]);
            setFuture([]);
        }
        setConfigState(newConfig);
    };

    const syncSelectionAfterStateChange = (newConfig: DynamicFormElementConfig, key: string | any) => {
        if (typeof key === 'string') {
            const data = JsonHelpers.findDataByKey(newConfig, key);
            if (data) {
                setSelectedConfig(data);
                const parentRes = JsonHelpers.findParentAndIndexByKey(newConfig, key);
                setParentConfig(parentRes ? parentRes.parent : null);
            } else {
                setSelectedConfig(null);
                setParentConfig(null);
                setSelectedNodeKey(null);
            }
        }
    };

    const undo = () => {
        if (past.length === 0) return;

        // Reset debounced history
        if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
        setIsChangeInProgress(false);

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);
        setPast(newPast);
        setFuture([JSON.parse(JSON.stringify(config)), ...future]);
        setConfigState(previous);

        // Sync selectedConfig with the new tree instance
        if (selectedNodeKey) {
            syncSelectionAfterStateChange(previous, selectedNodeKey);
        }
    };

    const redo = () => {
        if (future.length === 0) return;

        // Reset debounced history
        if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
        setIsChangeInProgress(false);

        const next = future[0];
        const newFuture = future.slice(1);
        setFuture(newFuture);
        setPast([...past, JSON.parse(JSON.stringify(config))]);
        setConfigState(next);

        // Sync selectedConfig with the new tree instance
        if (selectedNodeKey) {
            syncSelectionAfterStateChange(next, selectedNodeKey);
        }
    };

    const getMetadataForConfig = (cfg: DynamicFormContainerConfig | DynamicFieldConfig) => {
        return finalNestedContainerConfigMetadata;
    };

    const handleConfigChange = (newData: any) => {
        if (selectedConfig) {
            // Debounced history: only push if we are starting a new change block
            if (!isChangeInProgress) {
                setPast([...past, JSON.parse(JSON.stringify(config))]);
                setFuture([]);
                setIsChangeInProgress(true);
            }

            // Clear any pending timeout and start a new one to end the change block after 1.5s
            if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
            historyTimeoutRef.current = setTimeout(() => {
                setIsChangeInProgress(false);
            }, 1500);

            Object.assign(selectedConfig, newData);
            setConfigState({ ...config });

            // Re-sync parent config in case structural changes happened
            if (selectedNodeKey && typeof selectedNodeKey === 'string') {
                const parentRes = JsonHelpers.findParentAndIndexByKey(config, selectedNodeKey);
                setParentConfig(parentRes ? parentRes.parent : null);
            }
        }
    };

    const handleSubmit = async () => {
        const isValid = await trigger();
        if (!isValid) return;
        const data = getValues();
        onSubmit({ config, configName: data.configName });
    };

    const copyConfig = () => {
        copyJSONWithFeedback({ jsonInput: config, message: "Configuración copiada al portapapeles" });
    };

    const saveConfig = useCallback(({ message = "Configuración guardada", clearRedoHistory = false }: { message: string, clearRedoHistory?: boolean }) => {
        // Reset debounced history to ensure current typing is "saved" conceptually as a stable state
        if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
        setIsChangeInProgress(false);

        localStorage.setItem(configName, JSON.stringify(config));
        showNotification({
            type: "success",
            message: message
        });
        if (clearRedoHistory) {
            setFuture([]);
        }
    }, [config, configName]);

    const handleCopyNode = (node: TreeNode) => {
        if (!node.data) return;
        copyJSONWithFeedback({ jsonInput: node.data, message: "Configuración del nodo copiada" });
    };

    const handleImportConfirm = () => {
        try {
            const parsed = JSON.parse(importJson);

            if (rightClickedNode && rightClickedNode.key) {
                // Reset debounced history
                if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
                setIsChangeInProgress(false);

                const newConfig = JSON.parse(JSON.stringify(config));
                const targetData = JsonHelpers.findDataByKey(newConfig, rightClickedNode.key as string);

                const errors = JsonHelpers.validateConfigAgainstMetadata(parsed, finalNestedContainerConfigMetadata, "", newConfig, targetData);

                if (errors.length > 0) {
                    setImportErrors(errors);
                    return;
                }
                // Save state to history
                setPast([...past, JSON.parse(JSON.stringify(config))]);
                setFuture([]);

                if (targetData) {
                    // Ensure children array exists
                    if (!targetData.children) {
                        targetData.children = [];
                    }

                    // RECURSIVE UNIQUIFICATION:
                    // 1. Collect all names currently in the form
                    const existingNames = JsonHelpers.collectAllNames(newConfig);
                    // 2. Transitively rename imported elements if they collide
                    JsonHelpers.uniquifyConfigRecursive(parsed, existingNames);

                    // Add as child
                    targetData.children.push(parsed);

                    setConfigState(newConfig);

                    showNotification({ type: "success", message: "Elemento importado como hijo con éxito (nombres unificados)" });
                    setImportDialogVisible(false);
                    setImportJson("");
                    setImportErrors([]);
                }
            }
        } catch (e: any) {
            setImportErrors([`JSON inválido: ${e.message}`]);
        }
    };

    const handleAIImport = (generatedConfig: DynamicFormElementConfig, targetNodeKey: string) => {
        // Reset debounced history
        if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
        setIsChangeInProgress(false);

        const newConfig = JSON.parse(JSON.stringify(config));
        const targetData = JsonHelpers.findDataByKey(newConfig, targetNodeKey);

        if (targetData) {
            // Save state to history
            setPast([...past, JSON.parse(JSON.stringify(config))]);
            setFuture([]);

            // Ensure children array exists
            if (!targetData.children) {
                targetData.children = [];
            }

            // RECURSIVE UNIQUIFICATION
            const existingNames = JsonHelpers.collectAllNames(newConfig);
            JsonHelpers.uniquifyConfigRecursive(generatedConfig, existingNames);

            // Add as child
            targetData.children.push(generatedConfig);

            setConfigState(newConfig);

            showNotification({ type: "success", message: "Formulario generado importado con éxito" });
            setAiGeneratorVisible(false);
        } else {
            showNotification({ type: "error", message: "No se encontró el nodo destino seleccionado" });
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => saveConfig({ message: "Guardando..." }), 100000);
        return () => clearInterval(intervalId);
    }, [saveConfig]);

    useEffect(() => {
        setElementsTree(JsonHelpers.convertConfigToElementsTree(config, "root"))
    }, [config]);

    const handleElementSelect = (cfg: DynamicFieldConfig | DynamicFormContainerConfig | any) => {
        setSelectedConfig(cfg as any);

        const findKeyByData = (treeNodes: TreeNode[], data: any): string | undefined => {
            for (const node of treeNodes) {
                if (node.data === data) {
                    return node.key as string;
                }
                if (node.children) {
                    const found = findKeyByData(node.children, data);
                    if (found) return found;
                }
            }
            return undefined;
        };

        const key = findKeyByData(elementsTree, cfg);
        if (key) {
            setSelectedNodeKey(key);
            const parentRes = JsonHelpers.findParentAndIndexByKey(config, key);
            setParentConfig(parentRes ? parentRes.parent : null);
        }
    }

    const getFormErrorMessage = (name: keyof { configName: string }) => {
        return (
            errors[name] && (
                <small className="p-error">{errors[name].message}</small>
            )
        );
    };

    useEffect(() => {
        if (!initialData) {
            const localConfig = localStorage.getItem(configName);
            if (localConfig && localConfig !== "{}") {
                setConfigState(JSON.parse(localConfig));
            }
        }
    }, [configName, initialData]);

    useEffect(() => {
        if (initialData) {
            reset({
                configName: initialData.configName
            });
            setConfigState(initialData.config);
        }
    }, [initialData]);

    return (<>
        <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-2 align-items-center">
                <Button
                    icon={<i className="fa fa-undo"></i>}
                    className="p-button-text p-button-secondary"
                    onClick={undo}
                    disabled={past.length === 0}
                    tooltip="Deshacer"
                />
                <Button
                    icon={<i className="fa fa-redo"></i>}
                    className="p-button-text p-button-secondary"
                    onClick={redo}
                    disabled={future.length === 0}
                    tooltip="Rehacer"
                />
                <Controller
                    name="configName"
                    control={control}
                    rules={{
                        required: "El nombre del formulario es requerido"
                    }}
                    render={({ field }) => (
                        <InputText
                            {...field}
                            className="w-100"
                        />
                    )}
                />
                {getFormErrorMessage("configName")}
            </div>
            <div className="d-flex gap-2">
                <Button
                    label="Generar con IA"
                    icon={<i className="fa fa-bolt me-1"></i>}
                    size="small"
                    onClick={() => setAiGeneratorVisible(true)}
                />
                <SplitButton
                    label="Guardar"
                    icon={<i className="fa fa-save me-1"></i>}
                    size="small"
                    onClick={handleSubmit}
                    disabled={!isValid || loading}
                    model={[
                        {
                            label: 'Copiar',
                            icon: <i className="fa fa-copy me-1"></i>,
                            command: copyConfig

                        },
                        {
                            label: 'Guardar',
                            icon: <i className="fa fa-save me-1"></i>,
                            command: handleSubmit,
                            disabled: !isValid
                        }
                    ]}
                />
            </div>
        </div>
        <div className="d-flex gap-2" style={{ zoom: 0.75 }}>
            <div className="d-flex flex-column" style={{ minWidth: '400px', maxWidth: '400px' }}>
                <h5>Elementos</h5>
                <Divider />
                <ContextMenu model={[
                    {
                        label: 'Eliminar',
                        icon: <i className="fa fa-trash"></i>,
                        command: () => {
                            if (rightClickedNode && rightClickedNode.key) {
                                // Reset debounced history
                                if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
                                setIsChangeInProgress(false);

                                // Save current state to history
                                setPast([...past, JSON.parse(JSON.stringify(config))]);
                                setFuture([]);

                                const newConfig = JSON.parse(JSON.stringify(config));
                                const result = JsonHelpers.findParentAndIndexByKey(newConfig, rightClickedNode.key as string);

                                if (result) {
                                    result.array.splice(result.index, 1);
                                    setConfigState(newConfig);
                                    // Clear selection if deleted
                                    if (selectedNodeKey === rightClickedNode.key) {
                                        setSelectedConfig(null);
                                        setParentConfig(null);
                                        setSelectedNodeKey(null);
                                    }
                                }
                            }
                        }
                    },
                    {
                        label: 'Copiar JSON',
                        icon: <i className="fa fa-copy"></i>,
                        command: () => {
                            if (rightClickedNode) handleCopyNode(rightClickedNode);
                        }
                    },
                    {
                        label: 'Importar JSON',
                        icon: <i className="fa fa-upload"></i>,
                        command: () => {
                            setImportErrors([]);
                            setImportJson("");
                            setImportDialogVisible(true);
                        }
                    }
                ]} ref={cm} />
                <Tree
                    pt={{
                        container: {
                            style: { paddingLeft: '0' }
                        },
                        subgroup: {
                            style: { paddingLeft: '1rem' }
                        }
                    }}
                    selectionKeys={selectedNodeKey}
                    value={elementsTree}
                    selectionMode="single"
                    dragdropScope="builder-tree"
                    onDragDrop={(e: any) => {
                        const dragKey = e.dragNode.key;
                        const updatedTree = e.value;

                        // 1. Update UI tree immediately to reflect the move in the UI
                        setElementsTree(updatedTree);

                        // Reset debounced history
                        if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
                        setIsChangeInProgress(false);

                        // 2. Save current state to history
                        setPast([...past, JSON.parse(JSON.stringify(config))]);
                        setFuture([]);

                        // 3. Reconstruct new config from the tree structure provided by PrimeReact
                        const newChildren = JsonHelpers.reconstructConfigFromTree(updatedTree);

                        // 4. Update the configuration state, cleaning legacy arrays at the root
                        const newConfig = {
                            ...config,
                            children: newChildren,
                            containers: [],
                            fields: []
                        };

                        // 5. Refactor paths for rules/conditions
                        let newPath = "";
                        // Re-generate the tree with definitive paths from the new config, capturing the new path of the moved element
                        const stabilizedTree = JsonHelpers.convertConfigToElementsTree(newConfig, "root", "", (key, data) => {
                            if (data === e.dragNode.data) {
                                newPath = key;
                            }
                        });

                        if (newPath && dragKey && newPath !== dragKey) {
                            JsonHelpers.updateConfigPaths(newConfig, dragKey, newPath);
                        }

                        // 6. Set final state - This will trigger the useEffect to regenerate the tree again with correct keys
                        setConfigState(newConfig);

                        // 7. Sync selection to the new position
                        if (newPath) {
                            setSelectedNodeKey(newPath as any);
                            setSelectedConfig(e.dragNode.data);
                            const parentRes = JsonHelpers.findParentAndIndexByKey(newConfig, newPath);
                            setParentConfig(parentRes ? parentRes.parent : null);
                        }
                    }}
                    onSelectionChange={(e: TreeSelectionEvent) => {
                        setSelectedNodeKey(e.value);
                    }}
                    onSelect={(e: TreeEventNodeEvent) => {
                        setSelectedConfig(e.node.data);
                        const parentRes = JsonHelpers.findParentAndIndexByKey(config, e.node.key as string);
                        setParentConfig(parentRes ? parentRes.parent : null);
                    }}
                    onContextMenu={(e: any) => {
                        setRightClickedNode(e.node);
                        cm.current?.show(e.originalEvent);
                    }}
                />
            </div>
            <div className="flex-grow-1 overflow-auto" style={{ maxHeight: '100vh' }}>
                <h5>Formulario</h5>
                <Divider />
                <DynamicForm config={config} onSubmit={() => { }} onElementSelect={handleElementSelect} />
            </div>
            <div className="d-flex flex-column" style={{ minWidth: '400px', maxWidth: '400px', borderLeft: '1px solid #ddd' }}>
                <h5 className="p-3 pb-0">Configuración</h5>
                <Divider />
                <div className="overflow-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
                    {selectedConfig ? (
                        <JsonConfigurator
                            data={selectedConfig}
                            metadata={getMetadataForConfig(selectedConfig)}
                            onChange={handleConfigChange}
                            treeOptions={elementsTree}
                            parentData={parentConfig}
                        />
                    ) : (
                        <div className="p-3 text-gray-500">Seleccione un elemento para configurar</div>
                    )}
                </div>
            </div>
        </div>

        <Dialog
            header="Importar Configuración JSON"
            visible={importDialogVisible}
            style={{ width: '50vw' }}
            onHide={() => setImportDialogVisible(false)}
            footer={
                <div className="d-flex justify-content-end gap-2">
                    <Button label="Cancelar" icon="pi pi-times" onClick={() => setImportDialogVisible(false)} className="p-button-text" />
                    <Button label="Importar" icon="pi pi-check" onClick={handleImportConfirm} autoFocus />
                </div>
            }
        >
            <div className="p-fluid">
                <div className="field mb-3">
                    <p className="text-muted small">Pegue el JSON de la configuración del elemento. Se validará contra la metadata antes de aplicar.</p>
                    <InputTextarea
                        rows={10}
                        value={importJson}
                        onChange={(e) => setImportJson(e.target.value)}
                        placeholder='{ "type": "text", "name": "mi_campo", ... }'
                        className={importErrors.length > 0 ? "p-invalid" : ""}
                    />
                </div>
                {importErrors.length > 0 && (
                    <div className="p-3 bg-red-50 border-red-200 rounded border">
                        <h6 className="text-danger mb-2"><i className="fa fa-exclamation-triangle me-2"></i>Errores de validación:</h6>
                        <ul className="mb-0 ps-3 text-danger small">
                            {importErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Dialog>

        <AIFormGenerator
            visible={aiGeneratorVisible}
            onHide={() => setAiGeneratorVisible(false)}
            onImport={handleAIImport}
            treeOptions={elementsTree}
        />
    </>);
};
