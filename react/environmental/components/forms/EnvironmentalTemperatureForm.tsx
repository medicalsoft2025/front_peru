import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { InputNumber } from 'primereact/inputnumber';
import { Tooltip } from 'primereact/tooltip';
import { useEnvironmentalAreas } from '../../hooks/areas/useEnvironmentalAreas';
import { StoreEnvironmentalTemperatureRecordParams } from '../../interfaces/types';

interface EnvironmentalTemperatureFormProps {
    formId: string;
    date: Date;
    onSave: (data: StoreEnvironmentalTemperatureRecordParams) => Promise<any>;
}

export const EnvironmentalTemperatureForm = ({ formId, date, onSave }: EnvironmentalTemperatureFormProps) => {
    const { areas } = useEnvironmentalAreas();
    const { control, handleSubmit } = useForm({
        defaultValues: {
            items: [] as {
                environmental_area_id: number;
                area_name: string;
                value_am?: number;
                value_pm?: number;
            }[]
        }
    });

    const { fields, replace } = useFieldArray({
        control,
        name: "items"
    });

    useEffect(() => {
        if (areas.length > 0) {
            replace(areas.map(a => ({
                environmental_area_id: Number(a.id),
                area_name: a.name,
                value_am: undefined,
                value_pm: undefined
            })));
        }
    }, [areas, replace]);

    const onSubmit = async (data: any) => {
        const items = data.items
            .filter((item: any) => item.value_am !== undefined || item.value_pm !== undefined)
            .map((item: any) => ({
                environmental_area_id: item.environmental_area_id,
                value_am: item.value_am,
                value_pm: item.value_pm
            }));

        if (items.length === 0) return;

        const dateStr = date.toISOString().split('T')[0];

        await onSave({
            date: dateStr,
            items
        });
    };

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-2">
                <div className="d-none d-md-flex row px-2 mb-2 text-muted fw-bold">
                    <div className="col-4">Área</div>
                    <div className="col-4">AM (°C)</div>
                    <div className="col-4">PM (°C)</div>
                </div>
                {fields.map((field, index) => (
                    <div key={field.id} className="card p-3 shadow-sm border-0 mb-2">
                        <div className="row align-items-center">
                            <div className="col-12 col-md-4 mb-2 mb-md-0">
                                <span
                                    className="fw-bold text-truncate d-block"
                                    id={`area-label-${field.environmental_area_id}`}
                                    data-pr-tooltip={field.area_name}
                                >
                                    {field.area_name}
                                </span>
                                <Tooltip target={`#area-label-${field.environmental_area_id}`} />
                            </div>
                            <div className="col-6 col-md-4">
                                <label className="d-block d-md-none mb-1 text-muted small">AM (°C)</label>
                                <Controller
                                    name={`items.${index}.value_am`}
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            value={field.value}
                                            onValueChange={(e) => field.onChange(e.value)}
                                            onChange={(e) => field.onChange(e.value)}
                                            maxFractionDigits={1}
                                            className="w-100"
                                            placeholder="AM"
                                        />
                                    )}
                                />
                            </div>
                            <div className="col-6 col-md-4">
                                <label className="d-block d-md-none mb-1 text-muted small">PM (°C)</label>
                                <Controller
                                    name={`items.${index}.value_pm`}
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            value={field.value}
                                            onValueChange={(e) => field.onChange(e.value)}
                                            onChange={(e) => field.onChange(e.value)}
                                            maxFractionDigits={1}
                                            className="w-100"
                                            placeholder="PM"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </form>
    );
};
