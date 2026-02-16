import React from 'react';
import { PlanEstudioTable } from "./PlanEstudioTable";
import { useLocalStorageContext } from "../context/LocalStorageContext";
import { PlanEstudioFormData } from '../interfaces/types';
import { usePRToast } from '../../hooks/usePRToast';

interface Props {
    onEdit: (item: PlanEstudioFormData) => void;
}

export const PlanEstudioTableContainer = (props: Props) => {

    const { onEdit } = props;
    const { items, loadingItems, getItems, removeItem } = useLocalStorageContext<PlanEstudioFormData>();
    const { showSuccessToast, showServerErrorsToast } = usePRToast();

    const handleRemove = async (id: string) => {
        try {
            await removeItem(id);
            showSuccessToast({ title: 'Éxito', message: 'Item eliminado exitosamente' });
        } catch (error) {
            showServerErrorsToast(error);
        }
    }

    return (
        <PlanEstudioTable
            items={items}
            loadingItems={loadingItems}
            onReload={getItems}
            removeItem={handleRemove}
            editItem={onEdit}
        />
    );
}