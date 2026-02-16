import React, { useState } from 'react';
import { EnvironmentalCalendarFilters } from './EnvironmentalCalendarFilters';
import { EnvironmentalCalendarFilterItem } from './EnvironmentalCalendarFilterItem';
import { EnvironmentalCalendarFilterItemInterface, EnvironmentalCalendarFilterTreeItemInterface, EnvironmentalCalendarFilterType } from '../interfaces/types';

interface EnvironmentalAreaProtocolListProps {
    items: EnvironmentalCalendarFilterTreeItemInterface[];
    onAddAreaButtonClick: () => void;
    onAddProtocolButtonClick: () => void;
    onAreaSelect: (area: EnvironmentalCalendarFilterItemInterface) => void;
    onProtocolSelect: (protocol: EnvironmentalCalendarFilterItemInterface) => void;
    onEditArea?: (area: EnvironmentalCalendarFilterItemInterface) => void;
    onDeleteArea?: (area: EnvironmentalCalendarFilterItemInterface) => void;
    onEditProtocol?: (protocol: EnvironmentalCalendarFilterItemInterface) => void;
    onDeleteProtocol?: (protocol: EnvironmentalCalendarFilterItemInterface) => void;
    onAreaInteract?: (area: EnvironmentalCalendarFilterItemInterface) => void;
    onProtocolInteract?: (protocol: EnvironmentalCalendarFilterItemInterface) => void;
    selectedArea?: EnvironmentalCalendarFilterItemInterface | null;
    selectedProtocol?: EnvironmentalCalendarFilterItemInterface | null;
}

export const EnvironmentalAreaProtocolList = ({
    items,
    onAddAreaButtonClick,
    onAddProtocolButtonClick,
    onAreaSelect,
    onProtocolSelect,
    onEditArea,
    onDeleteArea,
    onEditProtocol,
    onDeleteProtocol,
    onAreaInteract,
    onProtocolInteract,
    selectedArea,
    selectedProtocol
}: EnvironmentalAreaProtocolListProps) => {
    const [collapsedAreas, setCollapsedAreas] = useState<Record<string, boolean>>({});

    const toggleArea = (areaId: string) => {
        setCollapsedAreas(prev => ({
            ...prev,
            [areaId]: !prev[areaId]
        }));
    };

    return (
        <>
            <EnvironmentalCalendarFilters
                items={items}
                itemTemplate={(area: EnvironmentalCalendarFilterTreeItemInterface) => {
                    const isCollapsed = collapsedAreas[area.id];
                    return (
                        <>
                            <div className="d-flex align-items-center gap-2">
                                <div
                                    className="d-flex align-items-center justify-content-center cursor-pointer p-1 color-primary"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleArea(area.id);
                                    }}
                                    style={{
                                        minWidth: '24px',
                                        minHeight: '24px',
                                        zIndex: 10,
                                        userSelect: 'none',
                                        transition: 'transform 0.2s',
                                        transform: isCollapsed ? 'rotate(0deg)' : 'rotate(90deg)',
                                    }}
                                >
                                    <i
                                        className="fa-solid fa-chevron-right color-primary"
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <EnvironmentalCalendarFilterItem
                                        item={area}
                                        onEdit={onEditArea}
                                        onDelete={onDeleteArea}
                                        onItemInteract={onAreaInteract}
                                        isActive={selectedArea?.id === area.id}
                                    />
                                </div>
                            </div>
                            {!isCollapsed && (
                                <div className="ps-3 mt-2">
                                    <EnvironmentalCalendarFilters
                                        items={area.subItems}
                                        itemTemplate={(protocol: EnvironmentalCalendarFilterItemInterface) => (
                                            <EnvironmentalCalendarFilterItem
                                                item={protocol}
                                                onEdit={onEditProtocol}
                                                onDelete={onDeleteProtocol}
                                                isActive={selectedProtocol?.id === protocol.id}
                                                onItemInteract={onProtocolInteract}
                                            />
                                        )}
                                        addButtonLabel="Añadir protocolo"
                                        onItemClick={(protocol) => {
                                            onProtocolSelect(protocol);
                                        }}
                                        onAddButtonClick={() => {
                                            onAddProtocolButtonClick();
                                            onAreaSelect(area);
                                        }}
                                        onItemInteract={onProtocolInteract}
                                    />
                                </div>
                            )}
                        </>
                    );
                }}
                addButtonLabel="Nuevo espacio"
                onAddButtonClick={onAddAreaButtonClick}
                onItemClick={(area) => onAreaSelect(area)}
                onEditItem={onEditArea}
                onDeleteItem={onDeleteArea}
                onItemInteract={onAreaInteract}
            />
        </>
    );
};