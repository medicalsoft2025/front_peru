import React, { useCallback, useState } from 'react';
import { PlanEstudioContext } from "../context/PlanEstudioContext.js";
import { useLocalItems } from "../hooks/useLocalItems.js";
import { useLocalCreate } from "../hooks/useLocalCreate.js";
import { useLocalUpdate } from "../hooks/useLocalUpdate.js";
import { useLocalRemove } from "../hooks/useLocalRemove.js";
// Provider del Context
export const PlanEstudioProvider = props => {
  const {
    children
  } = props;
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMode, setDialogMode] = useState('create');
  const [error, setError] = useState(null);
  const {
    items
  } = useLocalItems('planesEstudio');
  const {
    save
  } = useLocalCreate('planesEstudio');
  const {
    update
  } = useLocalUpdate('planesEstudio');
  const {
    remove
  } = useLocalRemove('planesEstudio');

  // Abrir diálogo para crear
  const abrirDialogoCrear = useCallback(() => {
    setSelectedPlan(null);
    setDialogMode('create');
    setDialogVisible(true);
  }, []);

  // Abrir diálogo para editar
  const abrirDialogoEditar = useCallback(plan => {
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
    cerrarDialogo
  };
  return /*#__PURE__*/React.createElement(PlanEstudioContext.Provider, {
    value: contextValue
  }, children);
};