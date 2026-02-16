import React, { useState, useMemo } from 'react';
import { useDynamicForm } from "../hooks/useDynamicForm.js";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { useDynamicFormValuesByForm } from "../hooks/useDynamicFormValuesByForm.js";
import { addHexHash } from "../../../services/utilidades.js";
import { AppFormRenderer } from "./AppFormRenderer.js";
/**
 * Interfaz para la información de los campos extraídos con soporte para rutas anidadas
 */
/**
 * Componente para visualizar los datos de un array en un diálogo secundario.
 * Permite manejar la recursividad de datos sin saturar la tabla principal.
 */
const ArrayDataViewer = ({
  visible,
  onHide,
  data,
  config,
  title,
  renderFieldData
}) => {
  // Extraemos los campos del interior del array para las columnas de la sub-tabla
  const subFields = useMemo(() => {
    const extract = cfg => {
      let fields = [];
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
      children?.forEach(child => {
        fields = [...fields, ...extract(child)];
      });
      return fields;
    };
    return extract(config);
  }, [config]);
  return /*#__PURE__*/React.createElement(Dialog, {
    header: title,
    visible: visible,
    onHide: onHide,
    style: {
      width: '60vw'
    },
    breakpoints: {
      '960px': '80vw',
      '641px': '100vw'
    },
    modal: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "mt-2"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: data,
    paginator: true,
    rows: 5,
    className: "p-datatable-sm shadow-sm rounded overflow-hidden",
    emptyMessage: "No hay items registrados.",
    stripedRows: true
  }, subFields.map(f => /*#__PURE__*/React.createElement(Column, {
    key: f.path,
    header: f.label,
    body: rowData => renderFieldData(rowData[f.name], f.config)
  })))));
};

/**
 * Componente principal CRUD dinámico.
 * Genera automáticamente columnas y templates basados en la configuración de DynamicForm.
 */
export const AppFormsCrud = () => {
  // Extracción manual de parámetros (compatibilidad con el proyecto)
  const getDynamicFormId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('dynamic_form_id');
  };
  const dynamic_form_id = getDynamicFormId();
  const {
    dynamicForm,
    isLoading,
    isFetching
  } = useDynamicForm(dynamic_form_id || '');
  const {
    data: dynamicFormValues,
    isLoading: isLoadingValues
  } = useDynamicFormValuesByForm(dynamic_form_id || '');
  const [displayDialog, setDisplayDialog] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  // Estado para el visor de arrays anidados
  const [arrayViewer, setArrayViewer] = useState({
    visible: false,
    data: [],
    title: ''
  });
  const tableItems = dynamicFormValues?.map(fv => fv.values) || [];

  /**
   * Función auxiliar para obtener valores de objetos anidados mediante un path string
   */
  const getNestedValue = (obj, path) => {
    if (!path || !obj) return undefined;
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  /**
   * Renderizador centralizado para diferentes tipos de datos.
   * Maneja fechas, colores, booleanos y mapeo de opciones.
   */
  const renderFieldData = (value, config) => {
    if (config.type === 'checkbox') {
      if (value === null || value === undefined || value === '') {
        return /*#__PURE__*/React.createElement("div", {
          className: "text-center"
        }, /*#__PURE__*/React.createElement("i", {
          className: "fa fa-times-circle text-danger fs-5 opacity-50"
        }));
      } else {
        return /*#__PURE__*/React.createElement("div", {
          className: "text-center"
        }, /*#__PURE__*/React.createElement("i", {
          className: "fa fa-check-circle text-success fs-5"
        }));
      }
    }
    if (value === null || value === undefined || value === '') return /*#__PURE__*/React.createElement("span", {
      className: "text-muted small"
    }, "---");
    switch (config.type) {
      case 'date':
      case 'datetime':
        try {
          // Manejo de fechas que vienen como string o objeto Date
          const date = new Date(value);
          if (isNaN(date.getTime())) return String(value);
          return date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: config.type === 'datetime' ? '2-digit' : undefined,
            minute: config.type === 'datetime' ? '2-digit' : undefined,
            hour12: true
          });
        } catch {
          return String(value);
        }
      case 'colorpicker':
        return /*#__PURE__*/React.createElement("div", {
          className: "d-flex align-items-center gap-2"
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: `${addHexHash(String(value))}`,
            border: '1px solid #dee2e6',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }
        }), /*#__PURE__*/React.createElement("span", {
          className: "small font-monospace text-uppercase"
        }, String(value)));
      case 'select':
      case 'radio':
      case 'multiselect':
        if (Array.isArray(value)) {
          return value.map(val => {
            const opt = config.options?.find(o => String(o.value) === String(val));
            return /*#__PURE__*/React.createElement("span", {
              key: val,
              className: "badge bg-light text-dark border me-1"
            }, opt ? opt.label : val);
          });
        }
        const option = config.options?.find(opt => String(opt.value) === String(value));
        return option ? option.label : String(value);
      case "editor":
        return /*#__PURE__*/React.createElement("div", {
          className: "text-wrap small",
          style: {
            maxHeight: '150px',
            overflowY: 'auto'
          },
          dangerouslySetInnerHTML: {
            __html: String(value)
          }
        });
      default:
        if (typeof value === 'object') {
          return /*#__PURE__*/React.createElement("span", {
            className: "small text-truncate d-inline-block text-muted",
            style: {
              maxWidth: '150px'
            },
            title: JSON.stringify(value)
          }, JSON.stringify(value));
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
    const extractFields = (config, parentPath = '') => {
      let foundFields = [];
      const pathContainers = ["form", "array"];
      const containerTypes = ["card", "form", "tabs", "tab", "accordion", "stepper", "array", "container"];

      // Resolución del path: solo form y array anidan nombres en la data
      const currentPath = config.name && pathContainers.includes(config.type) ? parentPath ? `${parentPath}.${config.name}` : config.name : parentPath;

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
  const openNew = () => {
    setSelectedData(null);
    setDisplayDialog(true);
  };
  const editRecord = rowData => {
    setSelectedData(rowData);
    setDisplayDialog(true);
  };
  const hideDialog = () => setDisplayDialog(false);

  /**
   * Template para el renderizado de celdas en la DataTable
   */
  const columnBodyTemplate = (rowData, f) => {
    const value = getNestedValue(rowData, f.path);

    // Template específico para Arrays
    if (f.type === 'array') {
      const items = Array.isArray(value) ? value : [];
      return /*#__PURE__*/React.createElement(Button, {
        label: `Ver ${items.length} items`,
        icon: /*#__PURE__*/React.createElement("i", {
          className: "fa fa-list-ul me-2"
        }),
        severity: "info",
        onClick: () => setArrayViewer({
          visible: true,
          data: items,
          config: f.config,
          title: f.label || f.name
        }),
        disabled: items.length === 0,
        style: {
          borderRadius: '20px',
          padding: '0.25rem 0.75rem'
        }
      });
    }
    return renderFieldData(value, f.config);
  };
  const actionBodyTemplate = rowData => {
    return /*#__PURE__*/React.createElement("div", {
      className: "d-flex gap-2 justify-content-center"
    }, /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-pencil"
      }),
      onClick: () => editRecord(rowData),
      tooltip: "Editar"
    }), /*#__PURE__*/React.createElement(Button, {
      icon: /*#__PURE__*/React.createElement("i", {
        className: "fa fa-trash"
      }),
      className: "p-button-danger",
      onClick: () => console.log('Delete logic missing'),
      tooltip: "Eliminar"
    }));
  };
  if (isFetching || isLoading) return /*#__PURE__*/React.createElement("div", {
    className: "d-flex justify-content-center align-items-center vh-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "spinner-grow text-primary",
    role: "status"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-2 text-muted fw-bold"
  }, "Cargando configuraci\xF3n...")));
  if (!dynamicForm) return /*#__PURE__*/React.createElement("div", {
    className: "container p-5 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "alert alert-danger shadow-sm border-0 py-4"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "alert-heading fw-bold"
  }, "Error de Configuraci\xF3n"), /*#__PURE__*/React.createElement("p", {
    className: "mb-0"
  }, "No se pudo encontrar el formulario con ID: ", /*#__PURE__*/React.createElement("strong", null, dynamic_form_id))));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "container-fluid p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 bg-white p-4 rounded shadow-sm border-bottom border-primary border-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 mb-md-0"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "m-0 h3 text-dark fw-bold"
  }, dynamicForm.name)), /*#__PURE__*/React.createElement(Button, {
    label: "Agregar Registro",
    icon: /*#__PURE__*/React.createElement("i", {
      className: "fa fa-plus-circle me-2"
    }),
    className: "p-button-primary p-button-raised",
    onClick: openNew,
    style: {
      borderRadius: '8px'
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded shadow-sm overflow-hidden border"
  }, /*#__PURE__*/React.createElement(DataTable, {
    value: tableItems,
    paginator: true,
    rows: 10,
    emptyMessage: "A\xFAn no hay registros en este formulario.",
    stripedRows: true,
    loading: isLoadingValues,
    scrollable: true
  }, fields.map(f => /*#__PURE__*/React.createElement(Column, {
    key: f.path,
    header: f.label,
    body: rowData => columnBodyTemplate(rowData, f),
    sortable: true,
    className: "text-truncate",
    style: {
      minWidth: '150px'
    }
  })), /*#__PURE__*/React.createElement(Column, {
    header: "Acciones",
    body: actionBodyTemplate,
    style: {
      width: '100px',
      textAlign: 'center'
    },
    frozen: true,
    headerClassName: "text-center"
  }))), /*#__PURE__*/React.createElement(Dialog, {
    header: selectedData ? `Editar Registro` : `Nuevo Registro`,
    visible: displayDialog,
    style: {
      width: '75vw'
    },
    modal: true,
    onHide: hideDialog,
    headerClassName: "border-bottom pb-3",
    contentClassName: "p-0" // Remove padding to let Renderer handle it or keep consistency
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4"
  }, dynamic_form_id && /*#__PURE__*/React.createElement(AppFormRenderer, {
    dynamicFormId: dynamic_form_id,
    initialData: selectedData,
    onSaveSuccess: () => {
      hideDialog();
    },
    onCancel: hideDialog,
    showCancelButton: true
  }))), arrayViewer.config && /*#__PURE__*/React.createElement(ArrayDataViewer, {
    config: arrayViewer.config,
    data: arrayViewer.data,
    title: arrayViewer.title,
    visible: arrayViewer.visible,
    onHide: () => setArrayViewer(prev => ({
      ...prev,
      visible: false
    })),
    renderFieldData: renderFieldData
  })));
};