import React from 'react';
import { EnvironmentalCalendarFilters } from './EnvironmentalCalendarFilters';
import { EnvironmentalCalendarFilterItemInterface, EnvironmentalCalendarFilterType } from '../interfaces/types';

interface EnvironmentalAreaListProps {
    items: EnvironmentalCalendarFilterItemInterface[];
    onAddAreaButtonClick: () => void;
    onAreaSelect: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onEditArea?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onDeleteArea?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onAreaInteract?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    selectedItem?: EnvironmentalCalendarFilterItemInterface | null;
}

export const EnvironmentalAreaList = ({
    items,
    onAddAreaButtonClick,
    onAreaSelect,
    onEditArea,
    onDeleteArea,
    onAreaInteract,
    selectedItem
}: EnvironmentalAreaListProps) => {
    return (
        <>
            <EnvironmentalCalendarFilters
                items={items}
                addButtonLabel="Nuevo espacio"
                onAddButtonClick={onAddAreaButtonClick}
                onItemClick={(item) => onAreaSelect(item)}
                onEditItem={onEditArea}
                onDeleteItem={onDeleteArea}
                selectedItem={selectedItem}
                onItemInteract={onAreaInteract}
            />
        </>
    );
};