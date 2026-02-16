import React from "react";
import { FieldValues, UseFormReturn, UseFieldArrayReturn } from "react-hook-form";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DynamicFormElementConfig } from "../../interfaces/models";
import { FormProvider } from "../../providers/FormProvider";
import { DynamicFormContainer } from "./DynamicFormContainer";
import { useFieldConditions } from "../../hooks/useFieldConditions";
import { useFormContext } from "../../context/FormContext";

// Componente celda extraido para permitir el uso correcto de hooks
const DynamicTableArrayCell = <T extends FieldValues>({
    colNode,
    rowData,
    fields,
    form,
    parentPath
}: {
    colNode: DynamicFormElementConfig;
    rowData: any;
    fields: any[];
    form: UseFormReturn<T>;
    parentPath: string;
}) => {
    // Calcular index real basado en el ID del field array
    const realIndex = fields.findIndex((f) => f.id === rowData.id);

    // Hooks ahora se ejecutan incondicionalmente dentro del componente
    const { fieldStates } = useFieldConditions({
        config: colNode,
        form,
        basePath: `${parentPath}.${realIndex}`,
        // Importante: pasar un key único o asegurar que basePath cambia
    });

    const parentContext = useFormContext();

    const mergedFieldStates = {
        ...parentContext.fieldStates,
        ...fieldStates,
    };

    // Si no encontramos el index (e.g. durante borrado), retornar null o fallback
    if (realIndex === -1) return null;

    return (
        <FormProvider value={{
            fieldStates: mergedFieldStates,
            form: form as UseFormReturn<FieldValues>,
            setFieldState: parentContext.setFieldState,
            onElementSelect: parentContext.onElementSelect,
            sources: parentContext.sources
        }}>
            <DynamicFormContainer
                config={colNode}
                form={form}
                parentPath={`${parentPath}.${realIndex}`}
                className="w-full"
            />
        </FormProvider>
    );
};

interface DynamicTableArrayProps<T extends FieldValues> {
    config: DynamicFormElementConfig;
    form: UseFormReturn<T>;
    fields: UseFieldArrayReturn<T>["fields"];
    append: UseFieldArrayReturn<T>["append"];
    remove: UseFieldArrayReturn<T>["remove"];
    parentPath: string;
}

export const DynamicTableArray = <T extends FieldValues>({
    config,
    form,
    fields,
    append,
    remove,
    parentPath
}: DynamicTableArrayProps<T>) => {

    const arrayConfig = config.arrayConfig || {};
    const tableConfig = arrayConfig.tableConfig || {};

    const getRealIndex = (rowData: any) => {
        return fields.findIndex((f) => f.id === rowData.id);
    };

    const actionBodyTemplate = (rowData: any) => {
        const index = getRealIndex(rowData);
        return (
            <Button
                icon={<i className="fa fa-trash me-1"></i>}
                className="p-button-danger p-button-text p-button-sm"
                onClick={() => remove(index)}
                type="button"
                tooltip={arrayConfig.removeLabel || "Eliminar"}
            />
        );
    };

    const header = (
        <div className="d-flex justify-content-between align-items-center">
            <span className="text-xl font-bold">{config.label}</span>
            <Button
                label={arrayConfig.addLabel || "Agregar"}
                icon={<i className="fa fa-plus"></i>}
                onClick={() => append({} as any)}
                type="button"
                size="small"
            />
        </div>
    );

    // Wrapper para el body template que renderiza el componente Cell
    const cellBodyTemplate = (colNode: DynamicFormElementConfig) => (rowData: any) => {
        return (
            <DynamicTableArrayCell
                colNode={colNode}
                rowData={rowData}
                fields={fields}
                form={form}
                parentPath={parentPath}
            />
        );
    };

    return (

        <div className={`dynamic-table-array mb-4 ${config.styleClass || ""}`}>
            <DataTable
                value={fields}
                header={header}
                showGridlines={tableConfig.showGridlines}
                stripedRows={tableConfig.stripedRows}
                size="small"
                resizableColumns={tableConfig.resizableColumns}
                reorderableColumns={tableConfig.reorderableColumns}
                paginator={tableConfig.paginator}
                rows={tableConfig.rows || 5}
                tableStyle={{ minWidth: '50rem' }}
                emptyMessage="No hay registros"
                // Importante: usar dataKey para estabilidad
                dataKey="id"
            >
                {(config?.children || config?.containers)?.map((col, i) => {
                    const key = col.name || `col-${i}`;
                    const header = col.label || col.name || `Col ${i + 1}`;
                    const fieldName = col.name;

                    return (
                        <Column
                            key={key}
                            header={header}
                            body={cellBodyTemplate(col)}
                            style={{ minWidth: '150px' }}
                            field={fieldName}
                        />
                    )
                })}

                <Column
                    body={actionBodyTemplate}
                    exportable={false}
                    style={{ width: '4rem', textAlign: 'center' }}
                />
            </DataTable>
        </div>
    );
};
