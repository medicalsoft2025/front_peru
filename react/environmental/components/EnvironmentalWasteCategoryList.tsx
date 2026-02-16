import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { EnvironmentalCalendarFilterItemInterface } from '../interfaces/types';
import { useUsersForSelect } from '../../users/hooks/useUsersForSelect';
import { EnvironmentalCalendarFilters } from './EnvironmentalCalendarFilters';

interface EnvironmentalWasteCategoryListProps {
    items: EnvironmentalCalendarFilterItemInterface[];
    onAddWasteCategoryButtonClick: () => void;
    onWasteCategorySelect: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onEditWasteCategory?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onDeleteWasteCategory?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onWasteCategoryInteract?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    selectedItem?: EnvironmentalCalendarFilterItemInterface | null;
    selectedIssuer?: string | null;
    onIssuerSelect?: (issuerId: string | null) => void;
}

export const EnvironmentalWasteCategoryList = ({
    items,
    onAddWasteCategoryButtonClick,
    onWasteCategorySelect,
    onEditWasteCategory,
    onDeleteWasteCategory,
    onWasteCategoryInteract,
    selectedItem,
    selectedIssuer,
    onIssuerSelect
}: EnvironmentalWasteCategoryListProps) => {
    const { users } = useUsersForSelect();

    return (
        <div className="d-flex flex-column gap-3">
            <div className="d-flex flex-column gap-1">
                <label className="form-label">Emisor</label>
                <Dropdown
                    value={selectedIssuer}
                    options={users}
                    onChange={(e) => onIssuerSelect?.(e.value)}
                    optionLabel="label"
                    optionValue="value"
                    placeholder="Filtrar por emisor"
                    className="w-100"
                    showClear
                    filter
                />
            </div>
            <EnvironmentalCalendarFilters
                items={items}
                addButtonLabel="Nueva categoría"
                onAddButtonClick={onAddWasteCategoryButtonClick}
                onItemClick={(item) => onWasteCategorySelect(item)}
                onEditItem={onEditWasteCategory}
                onDeleteItem={onDeleteWasteCategory}
                selectedItem={selectedItem}
                onItemInteract={onWasteCategoryInteract}
            />
        </div>
    );
};