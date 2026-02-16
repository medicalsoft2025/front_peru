import React, { createContext, useContext } from "react";
import { BaseEntity } from "../interfaces/types";

export interface LocalStorageContextType<T extends BaseEntity> {
    items: T[];
    loadingItems: boolean;
    loadingItem: boolean;
    selectedItem: T | null;
    saveItem: (data: Omit<T, 'id'> | T) => void;
    removeItem: (id: string) => void;
    getItem: (id: string) => void;
    getItems: () => void;
    setSelectedItem: (item: T | null) => void;
}

// Create a generic context
// Note: React.createContext cannot be generic in the way we want for the default value
// We will cast it when using the hook
export const LocalStorageContext = createContext<LocalStorageContextType<any> | undefined>(undefined);

export const useLocalStorageContext = <T extends BaseEntity>() => {
    const context = useContext(LocalStorageContext);
    if (!context) {
        throw new Error("useLocalStorageContext must be used within LocalStorageProvider");
    }
    return context as LocalStorageContextType<T>;
};
