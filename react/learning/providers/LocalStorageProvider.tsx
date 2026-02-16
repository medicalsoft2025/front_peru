import React, { useCallback, useMemo } from 'react';
import { LocalStorageContext } from '../context/LocalStorageContext';
import { BaseEntity } from '../interfaces/types';
import { useLocalItems } from '../hooks/useLocalItems';
import { useLocalItem } from '../hooks/useLocalItem';
import { useLocalCreate } from '../hooks/useLocalCreate';
import { useLocalUpdate } from '../hooks/useLocalUpdate';
import { useLocalRemove } from '../hooks/useLocalRemove';

interface LocalStorageProviderProps {
    localStorageKey: string;
    children: React.ReactNode;
}

export const LocalStorageProvider = <T extends BaseEntity>(props: LocalStorageProviderProps) => {

    const { children, localStorageKey } = props;

    // Use Hooks (Composition Root)
    const { items, loading: loadingItems, getItems } = useLocalItems<T>(localStorageKey);
    const { item: selectedItem, setItem: setSelectedItem, loading: loadingItem, getItem } = useLocalItem<T>(localStorageKey);
    const { create } = useLocalCreate<T>(localStorageKey);
    const { update } = useLocalUpdate<T>(localStorageKey);
    const { remove } = useLocalRemove<T>(localStorageKey);

    // Consolidated Actions
    const saveItem = useCallback(async (data: Omit<T, 'id'> | T) => {
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

    const removeItem = useCallback(async (id: string) => {
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

    return (
        <LocalStorageContext.Provider value={contextValue}>
            {children}
        </LocalStorageContext.Provider>
    );
};