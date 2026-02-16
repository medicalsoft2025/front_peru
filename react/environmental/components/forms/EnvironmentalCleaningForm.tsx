import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Checkbox } from 'primereact/checkbox';
import { useEnvironmentalAreas } from '../../hooks/areas/useEnvironmentalAreas';
import { StoreEnvironmentalCleaningRecordParams } from '../../interfaces/types';

interface EnvironmentalCleaningFormProps {
    formId: string;
    date: Date;
    onSave: (data: StoreEnvironmentalCleaningRecordParams) => Promise<any>;
}

export const EnvironmentalCleaningForm = ({ formId, date, onSave }: EnvironmentalCleaningFormProps) => {
    const { areas } = useEnvironmentalAreas();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            items: [] as {
                protocol_id: number;
                protocol_name: string;
                area_name: string;
                is_compliant: boolean;
            }[]
        }
    });

    const { fields, replace } = useFieldArray({
        control,
        name: "items"
    });

    useEffect(() => {
        if (areas.length > 0) {
            const flattenedItems: any[] = [];
            areas.forEach(area => {
                if (area.protocols) {
                    area.protocols.forEach(protocol => {
                        flattenedItems.push({
                            protocol_id: Number(protocol.id),
                            protocol_name: protocol.name,
                            area_name: area.name,
                            is_compliant: false
                        });
                    });
                }
            });
            replace(flattenedItems);
        }
    }, [areas, replace]);

    const onSubmit = async (data: any) => {
        const items = data.items.map((item: any) => ({
            protocol_id: item.protocol_id,
            is_compliant: item.is_compliant
        }));

        if (items.length === 0) return;

        const dateStr = date.toISOString().split('T')[0];

        await onSave({
            date: dateStr,
            items
        });
    };

    // Helper to group fields by area for display
    const groupedFields = fields.reduce((acc, field, index) => {
        if (!acc[field.area_name]) {
            acc[field.area_name] = [];
        }
        acc[field.area_name].push({ field, index });
        return acc;
    }, {} as Record<string, { field: typeof fields[0], index: number }[]>);

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-3">
                {Object.entries(groupedFields).map(([areaName, fieldsInArea]) => (
                    <div key={areaName} className="card p-3 shadow-sm border-0">
                        <h5 className="mb-3 fw-bold text-primary">{areaName}</h5>
                        <div className="d-flex flex-column gap-2">
                            {fieldsInArea.map(({ field, index }) => (
                                <div key={field.id} className="d-flex align-items-center gap-2">
                                    <Controller
                                        name={`items.${index}.is_compliant`}
                                        control={control}
                                        render={({ field: controllerField }) => (
                                            <Checkbox
                                                inputId={`protocol_${field.protocol_id}`}
                                                checked={controllerField.value}
                                                onChange={(e) => controllerField.onChange(e.checked)}
                                            />
                                        )}
                                    />
                                    <label htmlFor={`protocol_${field.protocol_id}`} className="cursor-pointer user-select-none">
                                        {field.protocol_name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                {fields.length === 0 && <div className="text-muted fst-italic">No hay protocolos definidos</div>}
            </div>
        </form>
    );
};
