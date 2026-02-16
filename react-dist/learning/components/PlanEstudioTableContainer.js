import React from 'react';
import { PlanEstudioTable } from "./PlanEstudioTable.js";
import { useLocalStorageContext } from "../context/LocalStorageContext.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const PlanEstudioTableContainer = props => {
  const {
    onEdit
  } = props;
  const {
    items,
    loadingItems,
    getItems,
    removeItem
  } = useLocalStorageContext();
  const {
    showSuccessToast,
    showServerErrorsToast
  } = usePRToast();
  const handleRemove = async id => {
    try {
      await removeItem(id);
      showSuccessToast({
        title: 'Éxito',
        message: 'Item eliminado exitosamente'
      });
    } catch (error) {
      showServerErrorsToast(error);
    }
  };
  return /*#__PURE__*/React.createElement(PlanEstudioTable, {
    items: items,
    loadingItems: loadingItems,
    onReload: getItems,
    removeItem: handleRemove,
    editItem: onEdit
  });
};