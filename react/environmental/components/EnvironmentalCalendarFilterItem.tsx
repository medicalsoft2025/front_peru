import React, { useRef } from 'react';
import { EnvironmentalCalendarFilterItemInterface } from '../interfaces/types';
import { ContextMenu } from 'primereact/contextmenu';
import { MenuItem } from 'primereact/menuitem';

interface EnvironmentalCalendarFilterItemProps {
    item: EnvironmentalCalendarFilterItemInterface;
    onItemClick?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onItemInteract?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onEdit?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    onDelete?: (item: EnvironmentalCalendarFilterItemInterface) => void;
    isActive?: boolean;
}

export const EnvironmentalCalendarFilterItem = ({ item, onItemClick, onItemInteract, onEdit, onDelete, isActive }: EnvironmentalCalendarFilterItemProps) => {

    const cm = useRef<ContextMenu>(null);

    const items: MenuItem[] = [
        {
            label: 'Editar',
            icon: <i className="fas fa-pencil me-1" />,
            command: () => {
                onItemInteract?.(item);
                onEdit?.(item);
            }
        },
        {
            label: 'Eliminar',
            icon: <i className="fas fa-trash me-1" />,
            command: () => {
                onItemInteract?.(item);
                onDelete?.(item);
            }
        }
    ];

    return (
        <>
            <ContextMenu model={items} ref={cm} />
            <div
                className={`card mb-0 shadow-sm cursor-pointer hover-card ${isActive ? 'border-primary-500 border-2' : 'border-0'}`}
                onClick={() => onItemClick?.(item)}
                onContextMenu={(e) => {
                    onItemInteract?.(item);
                    cm.current?.show(e);
                }}
            >
                <div className="card-body p-2 d-flex justify-content-between align-items-center">
                    <span className="text-dark text-truncate">{item.name}</span>
                </div>
            </div>
        </>
    );
};