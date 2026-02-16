import React, { useCallback, useState } from 'react';
import { PlanEstudioContext } from '../context/PlanEstudioContext';
import { useLocalItems } from '../hooks/useLocalItems';
import { useLocalCreate } from '../hooks/useLocalCreate';
import { useLocalUpdate } from '../hooks/useLocalUpdate';
import { useLocalRemove } from '../hooks/useLocalRemove';

interface PlanEstudioProviderProps {
    children: React.ReactNode;
}

// Provider del Context
export const PlanEstudioProvider = (props: PlanEstudioProviderProps) => {

    const { children } = props;

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogMode, setDialogMode] = useState('create');
    const [error, setError] = useState(null);

    const { items } = useLocalItems('planesEstudio');
    const { save } = useLocalCreate('planesEstudio');
    const { update } = useLocalUpdate('planesEstudio');
    const { remove } = useLocalRemove('planesEstudio');

    // Abrir diálogo para crear
    const abrirDialogoCrear = useCallback(() => {
        setSelectedPlan(null);
        setDialogMode('create');
        setDialogVisible(true);
    }, []);

    // Abrir diálogo para editar
    const abrirDialogoEditar = useCallback((plan: any) => {
        setSelectedPlan(plan);
        setDialogMode('edit');
        setDialogVisible(true);
    }, []);

    // Cerrar diálogo
    const cerrarDialogo = useCallback(() => {
        setDialogVisible(false);
        setSelectedPlan(null);
        setError(null);
    }, []);

    // Valor del contexto
    const contextValue = {
        // Estado
        selectedPlan,
        dialogVisible,
        dialogMode,
        error,

        // Acciones
        items,
        save,
        update,
        remove,
        abrirDialogoCrear,
        abrirDialogoEditar,
        cerrarDialogo,
    };

    return (
        <PlanEstudioContext.Provider value={contextValue}>
            {children}
        </PlanEstudioContext.Provider>
    );
};