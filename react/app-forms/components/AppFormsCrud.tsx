import React, { useState, useMemo, useRef } from 'react';
import { useDynamicForm } from '../hooks/useDynamicForm';
import { DynamicForm, DynamicFormRef } from '../../dynamic-form/components/DynamicForm';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DynamicFormElementConfig } from '../../dynamic-form/interfaces/models';
import { useDynamicFormValuesByForm } from '../hooks/useDynamicFormValuesByForm';
import { addHexHash } from '../../../services/utilidades';
import { AppFormRenderer } from './AppFormRenderer';

/**
 * Interfaz para la información de los campos extraídos con soporte para rutas anidadas
 */
interface FieldInfo {
    name: string;
    label: string;
    path: string;
    type: string;
    config: DynamicFormElementConfig;
}

/**
 * Componente para visualizar los datos de un array en un diálogo secundario.
 * Permite manejar la recursividad de datos sin saturar la tabla principal.
 */
const ArrayDataViewer: React.FC<{
    visible: boolean;
    onHide: () => void;
    data: any[];
    config: DynamicFormElementConfig;
    title: string;
    renderFieldData: (value: any, config: DynamicFormElementConfig) => React.ReactNode;
}> = ({ visible, onHide, data, config, title, renderFieldData }) => {

    // Extraemos los campos del interior del array para las columnas de la sub-tabla
    const subFields = useMemo(() => {
        const extract = (cfg: DynamicFormElementConfig): FieldInfo[] => {
            let fields: FieldInfo[] = [];
            const containerTypes = ["card", "form", "tabs", "tab", "accordion", "stepper", "array", "container"];

            // En la sub-tabla la data ya viene por item, así que el path es directo
            if (cfg.name && !containerTypes.includes(cfg.type)) {
                fields.push({
                    name: cfg.name,
                    label: cfg.label || cfg.name,
                    path: cfg.name,
                    type: cfg.type,
                    config: cfg
                });
            }

            const children = cfg.children || cfg.fields || cfg.containers;
            children?.forEach(child => { fields = [...fields, ...extract(child)]; });
            return fields;
        };
        return extract(config);
    }, [config]);

    return (
        <Dialog
            header={title}
            visible={visible}
            onHide={onHide}
            style={{ width: '60vw' }}
            breakpoints={{ '960px': '80vw', '641px': '100vw' }}
            modal
        >
            <div className="mt-2">
                <DataTable
                    value={data}
                    paginator
                    rows={5}
                    className="p-datatable-sm shadow-sm rounded overflow-hidden"
                    emptyMessage="No hay items registrados."
                    stripedRows
                >
                    {subFields.map(f => (
                        <Column
                            key={f.path}
                            header={f.label}
                            body={(rowData) => renderFieldData(rowData[f.name], f.config)}
                        />
                    ))}
                </DataTable>
            </div>
        </Dialog>
    );
};

/**
 * Componente principal CRUD dinámico.
 * Genera automáticamente columnas y templates basados en la configuración de DynamicForm.
 */
export const AppFormsCrud: React.FC = () => {
    // Extracción manual de parámetros (compatibilidad con el proyecto)
    const getDynamicFormId = () => {
        const params = new URLSearchParams(window.location.search);
        return params.get('dynamic_form_id');
    };

    const dynamic_form_id = getDynamicFormId();
    const { dynamicForm, isLoading, isFetching } = useDynamicForm(dynamic_form_id || '');
    const { data: dynamicFormValues, isLoading: isLoadingValues } = useDynamicFormValuesByForm(dynamic_form_id || '');

    const [displayDialog, setDisplayDialog] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);

    // Estado para el visor de arrays anidados
    const [arrayViewer, setArrayViewer] = useState<{ visible: boolean; data: any[]; config?: DynamicFormElementConfig; title: string }>({
        visible: false,
        data: [],
        title: ''
    });

    const tableItems = dynamicFormValues?.map(fv => fv.values) || [];

    /**
     * Función auxiliar para obtener valores de objetos anidados mediante un path string
     */
    const getNestedValue = (obj: any, path: string) => {
        if (!path || !obj) return undefined;
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    /**
     * Renderizador centralizado para diferentes tipos de datos.
     * Maneja fechas, colores, booleanos y mapeo de opciones.
     */
    const renderFieldData = (value: any, config: DynamicFormElementConfig): React.ReactNode => {
        if (config.type === 'checkbox') {
            if (value === null || value === undefined || value === '') {
                return <div className="text-center">
                    <i className="fa fa-times-circle text-danger fs-5 opacity-50" />
                </div>
            } else {
                return <div className="text-center">
                    <i className="fa fa-check-circle text-success fs-5" />
                </div>
            }
        }
        if (value === null || value === undefined || value === '') return <span className="text-muted small">---</span>;

        switch (config.type) {
            case 'date':
            case 'datetime':
                try {
                    // Manejo de fechas que vienen como string o objeto Date
                    const date = new Date(value);
                    if (isNaN(date.getTime())) return String(value);
                    return date.toLocaleString(undefined, {
                        year: 'numeric', month: 'short', day: '2-digit',
                        hour: config.type === 'datetime' ? '2-digit' : undefined,
                        minute: config.type === 'datetime' ? '2-digit' : undefined,
                        hour12: true
                    });
                } catch { return String(value); }

            case 'colorpicker':
                return (
                    <div className="d-flex align-items-center gap-2">
                        <div style={{
                            width: '18px', height: '18px',
                            borderRadius: '50%',
                            backgroundColor: `${addHexHash(String(value))}`,
                            border: '1px solid #dee2e6',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}></div>
                        <span className="small font-monospace text-uppercase">{String(value)}</span>
                    </div>
                );
            case 'select':
            case 'radio':
            case 'multiselect':
                if (Array.isArray(value)) {
                    return value.map(val => {
                        const opt = config.options?.find(o => String(o.value) === String(val));
                        return <span key={val} className="badge bg-light text-dark border me-1">{opt ? opt.label : val}</span>;
                    });
                }
                const option = config.options?.find(opt => String(opt.value) === String(value));
                return option ? option.label : String(value);
            case "editor":
                return (
                    <div
                        className="text-wrap small"
                        style={{ maxHeight: '150px', overflowY: 'auto' }}
                        dangerouslySetInnerHTML={{ __html: String(value) }}
                    />
                );
            default:
                if (typeof value === 'object') {
                    return (
                        <span className="small text-truncate d-inline-block text-muted" style={{ maxWidth: '150px' }} title={JSON.stringify(value)}>
                            {JSON.stringify(value)}
                        </span>
                    );
                }
                return String(value);
        }
    };

    /**
     * Algoritmo de extracción de campos con resolución de rutas anidadas.
     * Solo 'form' y 'array' impactan en el path de la data.
     */
    const fields = useMemo(() => {
        if (!dynamicForm?.config) return [];

        const extractFields = (config: DynamicFormElementConfig, parentPath: string = ''): FieldInfo[] => {
            let foundFields: FieldInfo[] = [];
            const pathContainers = ["form", "array"];
            const containerTypes = ["card", "form", "tabs", "tab", "accordion", "stepper", "array", "container"];

            // Resolución del path: solo form y array anidan nombres en la data
            const currentPath = config.name && pathContainers.includes(config.type)
                ? (parentPath ? `${parentPath}.${config.name}` : config.name)
                : parentPath;

            // Caso especial: Contenedores tipo Array (Se muestran como una sola columna)
            if (config.name && config.type === 'array') {
                foundFields.push({
                    name: config.name,
                    label: config.label || config.name,
                    path: currentPath,
                    type: config.type,
                    config: config
                });
                return foundFields; // No extraemos sus hijos para la tabla principal
            }

            // Campos hoja (Leaf fields)
            if (config.name && !containerTypes.includes(config.type)) {
                foundFields.push({
                    name: config.name,
                    label: config.label || config.name,
                    path: currentPath ? `${currentPath}.${config.name}` : config.name,
                    type: config.type,
                    config: config
                });
            }

            // Procesar hijos recursivamente
            const children = config.children || config.fields || config.containers;
            children?.forEach(child => {
                foundFields = [...foundFields, ...extractFields(child, currentPath)];
            });

            return foundFields;
        };

        return extractFields(dynamicForm.config);
    }, [dynamicForm]);

    // Handlers de UI
    const openNew = () => { setSelectedData(null); setDisplayDialog(true); };
    const editRecord = (rowData: any) => { setSelectedData(rowData); setDisplayDialog(true); };
    const hideDialog = () => setDisplayDialog(false);

    /**
     * Template para el renderizado de celdas en la DataTable
     */
    const columnBodyTemplate = (rowData: any, f: FieldInfo) => {
        const value = getNestedValue(rowData, f.path);

        // Template específico para Arrays
        if (f.type === 'array') {
            const items = Array.isArray(value) ? value : [];
            return (
                <Button
                    label={`Ver ${items.length} items`}
                    icon={<i className="fa fa-list-ul me-2" />}
                    severity='info'
                    onClick={() => setArrayViewer({
                        visible: true,
                        data: items,
                        config: f.config,
                        title: f.label || f.name
                    })}
                    disabled={items.length === 0}
                    style={{ borderRadius: '20px', padding: '0.25rem 0.75rem' }}
                />
            );
        }

        return renderFieldData(value, f.config);
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <div className="d-flex gap-2 justify-content-center">
                <Button
                    icon={<i className="fa fa-pencil" />}
                    onClick={() => editRecord(rowData)}
                    tooltip="Editar"
                />
                <Button
                    icon={<i className="fa fa-trash" />}
                    className="p-button-danger"
                    onClick={() => console.log('Delete logic missing')}
                    tooltip="Eliminar"
                />
            </div>
        );
    };

    if (isFetching || isLoading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="text-center">
                <div className="spinner-grow text-primary" role="status"></div>
                <div className="mt-2 text-muted fw-bold">Cargando configuración...</div>
            </div>
        </div>
    );

    if (!dynamicForm) return (
        <div className="container p-5 text-center">
            <div className="alert alert-danger shadow-sm border-0 py-4">
                <h4 className="alert-heading fw-bold">Error de Configuración</h4>
                <p className="mb-0">No se pudo encontrar el formulario con ID: <strong>{dynamic_form_id}</strong></p>
            </div>
        </div>
    );

    return (<>
        <div className="container-fluid p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-bottom border-primary border-3">
                <div className="mb-3 mb-md-0">
                    <h1 className="m-0 h3 text-dark fw-bold">{dynamicForm.name}</h1>
                </div>
                <Button
                    label="Agregar Registro"
                    icon={<i className="fa fa-plus-circle me-2" />}
                    className="p-button-primary p-button-raised"
                    onClick={openNew}
                    style={{ borderRadius: '8px' }}
                />
            </div>

            <div className="bg-white rounded shadow-sm overflow-hidden border">
                <DataTable
                    value={tableItems}
                    paginator
                    rows={10}
                    emptyMessage="Aún no hay registros en este formulario."
                    stripedRows
                    loading={isLoadingValues}
                    scrollable
                >
                    {fields.map(f => (
                        <Column
                            key={f.path}
                            header={f.label}
                            body={(rowData) => columnBodyTemplate(rowData, f)}
                            sortable
                            className="text-truncate"
                            style={{ minWidth: '150px' }}
                        />
                    ))}
                    <Column
                        header="Acciones"
                        body={actionBodyTemplate}
                        style={{ width: '100px', textAlign: 'center' }}
                        frozen
                        headerClassName="text-center"
                    />
                </DataTable>
            </div>

            <Dialog
                header={selectedData ? `Editar Registro` : `Nuevo Registro`}
                visible={displayDialog}
                style={{ width: '75vw' }}
                modal
                onHide={hideDialog}
                headerClassName="border-bottom pb-3"
                contentClassName="p-0" // Remove padding to let Renderer handle it or keep consistency
            >
                <div className="p-4">
                    {dynamic_form_id && (
                        <AppFormRenderer
                            dynamicFormId={dynamic_form_id}
                            initialData={selectedData}
                            onSaveSuccess={() => {
                                hideDialog();
                            }}
                            onCancel={hideDialog}
                            showCancelButton={true}
                        />
                    )}
                </div>
            </Dialog>

            {arrayViewer.config && (
                <ArrayDataViewer
                    config={arrayViewer.config}
                    data={arrayViewer.data}
                    title={arrayViewer.title}
                    visible={arrayViewer.visible}
                    onHide={() => setArrayViewer(prev => ({ ...prev, visible: false }))}
                    renderFieldData={renderFieldData}
                />
            )}
        </div>
    </>);
};

