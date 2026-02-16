import React, { useEffect } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from 'primereact/utils';
import { useEnvironmentalWasteCategories } from '../../hooks/waste-categories/useEnvironmentalWasteCategories';
import { useUsersForSelect } from '../../../users/hooks/useUsersForSelect';
import { StoreEnvironmentalWasteRecordParams } from '../../interfaces/types';
import { Tooltip } from 'primereact/tooltip';

interface EnvironmentalWasteFormProps {
    formId: string;
    date: Date;
    onSave: (data: StoreEnvironmentalWasteRecordParams) => Promise<any>;
}

export const EnvironmentalWasteForm = ({ formId, date, onSave }: EnvironmentalWasteFormProps) => {
    const { wasteCategories } = useEnvironmentalWasteCategories();
    const { users } = useUsersForSelect();

    const { control, handleSubmit } = useForm({
        defaultValues: {
            emitter_user_id: '',
            items: [] as { category_id: number; category_name: string; value: number }[]
        }
    });

    const { fields, replace } = useFieldArray({
        control,
        name: "items"
    });

    useEffect(() => {
        if (wasteCategories.length > 0) {
            replace(wasteCategories.map(c => ({
                category_id: Number(c.id),
                category_name: c.name,
                value: 0
            })));
        }
    }, [wasteCategories, replace]);

    const onSubmit = async (data: any) => {
        const items = data.items
            .filter((item: any) => item.value > 0)
            .map((item: any) => ({
                category_id: item.category_id,
                value: item.value
            }));

        if (items.length === 0) {
            return;
        }

        const dateStr = date.toISOString().split('T')[0];

        await onSave({
            date: dateStr,
            issuer_id: data.emitter_user_id,
            items
        });
    };

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-2">
                <label className="fw-bold">Emisor</label>
                <Controller
                    name="emitter_user_id"
                    control={control}
                    rules={{ required: 'El emisor es requerido' }}
                    render={({ field, fieldState }) => (
                        <>
                            <Dropdown
                                value={field.value}
                                options={users}
                                onChange={(e) => field.onChange(e.value)}
                                optionLabel="label"
                                optionValue="value"
                                placeholder="Seleccione un emisor"
                                className={classNames('w-100', { 'p-invalid': fieldState.error })}
                                filter
                            />
                            {fieldState.error && <small className="p-error">{fieldState.error.message}</small>}
                        </>
                    )}
                />
            </div>
            <div className="d-flex flex-column gap-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="d-flex align-items-center justify-content-between p-2 border-bottom">
                        <div className="flex-grow-1 me-3" style={{ minWidth: 0 }}>
                            <span
                                className="fw-bold text-truncate d-block"
                                id={`category-label-${field.category_id}`}
                                data-pr-tooltip={field.category_name}
                            >
                                {field.category_name}
                            </span>
                            <Tooltip target={`#category-label-${field.category_id}`} />
                        </div>
                        <div style={{ width: '150px' }}>
                            <Controller
                                name={`items.${index}.value`}
                                control={control}
                                render={({ field }) => (
                                    <div className="p-inputgroup">
                                        <InputNumber
                                            value={field.value}
                                            onValueChange={(e) => field.onChange(e.value)}
                                            min={0}
                                            maxFractionDigits={2}
                                            placeholder="0"
                                            className="w-100"
                                        />
                                        <span className="p-inputgroup-addon">kg</span>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </form>
    );
};
