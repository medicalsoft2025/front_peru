import React from 'react';
import { Button } from 'primereact/button';
import { EnvironmentalCalendarFilterItemInterface } from '../interfaces/types';
import { EnvironmentalCalendarFilterItem } from './EnvironmentalCalendarFilterItem';

interface EnvironmentalCalendarFiltersProps {
    items: EnvironmentalCalendarFilterItemInterface[];
    onAddButtonClick: () => void;
    onItemClick?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onItemInteract?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    itemTemplate?: (item: EnvironmentalCalendarFilterItemInterface) => React.ReactNode;
    addButtonLabel?: string;
    onEditItem?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onDeleteItem?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    selectedItem?: EnvironmentalCalendarFilterItemInterface | null;
}

export const EnvironmentalCalendarFilters = ({
    items,
    addButtonLabel = 'Agregar',
    onAddButtonClick,
    onItemClick,
    onItemInteract,
    itemTemplate,
    onEditItem,
    onDeleteItem,
    selectedItem
}: EnvironmentalCalendarFiltersProps) => {
    return (
        <>
            <div className="d-flex flex-column gap-3">
                <div className="d-flex flex-column gap-2 border-start border-2 border-gray-200 p-2">
                    {items.map((item: EnvironmentalCalendarFilterItemInterface) => (<>
                        <div key={item.id} onClick={() => onItemClick?.(item)}>
                            {itemTemplate && (
                                <div key={item.id}>{itemTemplate(item)}</div>
                            )}
                            {!itemTemplate && (
                                <EnvironmentalCalendarFilterItem
                                    item={item}
                                    onEdit={onEditItem}
                                    onDelete={onDeleteItem}
                                    onItemInteract={onItemInteract}
                                    isActive={selectedItem?.id === item.id}
                                />
                            )}
                        </div>
                    </>))}
                </div>
                <Button
                    label={addButtonLabel}
                    icon={<i className="fas fa-plus me-1" />}
                    className="w-full"
                    text
                    onClick={onAddButtonClick}
                />
            </div>
        </>
    );
};