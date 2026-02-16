import React, { useCallback, useMemo } from 'react';
import { LocalStorageContext } from "../context/LocalStorageContext.js";
import { useLocalItems } from "../hooks/useLocalItems.js";
import { useLocalItem } from "../hooks/useLocalItem.js";
import { useLocalCreate } from "../hooks/useLocalCreate.js";
import { useLocalUpdate } from "../hooks/useLocalUpdate.js";
import { useLocalRemove } from "../hooks/useLocalRemove.js";
export const LocalStorageProvider = props => {
  const {
    children,
    localStorageKey
  } = props;

  // Use Hooks (Composition Root)
  const {
    items,
    loading: loadingItems,
    getItems
  } = useLocalItems(localStorageKey);
  const {
    item: selectedItem,
    setItem: setSelectedItem,
    loading: loadingItem,
    getItem
  } = useLocalItem(localStorageKey);
  const {
    create
  } = useLocalCreate(localStorageKey);
  const {
    update
  } = useLocalUpdate(localStorageKey);
  const {
    remove
  } = useLocalRemove(localStorageKey);

  // Consolidated Actions
  const saveItem = useCallback(async data => {
    try {
      if ('id' in data && data.id) {
        await update(data.id, data);
      } else {
        await create(data);
      }
      await getItems(); // Refresh items list after save
    } catch (error) {
      console.error("Error saving item", error);
      throw error;
    }
  }, [create, update, getItems]);
  const removeItem = useCallback(async id => {
    try {
      await remove(id);
      await getItems(); // Refresh items list after delete
    } catch (error) {
      console.error("Error removing item", error);
      throw error;
    }
  }, [remove, getItems]);
  const contextValue = useMemo(() => ({
    items,
    selectedItem,
    loadingItems,
    loadingItem,
    saveItem,
    removeItem,
    getItem,
    getItems,
    setSelectedItem
  }), [items, selectedItem, loadingItems, loadingItem, saveItem, removeItem, getItem, getItems, setSelectedItem]);
  return /*#__PURE__*/React.createElement(LocalStorageContext.Provider, {
    value: contextValue
  }, children);
};