import React from "react";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persistOptions } from "../config/queryClientPersistence";

// Extend Window interface to include globalQueryClient
declare global {
    interface Window {
        globalQueryClient: QueryClient;
    }
}

interface PersistentQueryProviderProps {
    children: React.ReactNode;
}

/**
 * Wrapper component que proporciona el QueryClient global con persistencia en IndexedDB
 * Usa este componente en lugar de configurar PersistQueryClientProvider manualmente
 * 
 * @example
 * export const MyComponent = () => {
 *   return (
 *     <PersistentQueryProvider>
 *       <MyTable />
 *     </PersistentQueryProvider>
 *   );
 * };
 */
export const PersistentQueryProvider: React.FC<PersistentQueryProviderProps> = ({ children }) => {
    const queryClient = window.globalQueryClient;

    if (!queryClient) {
        console.error('❌ Global QueryClient not found. Make sure menu.php has initialized it.');
        return <div>Error: QueryClient not initialized</div>;
    }

    return (
        <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
            {children}
        </PersistQueryClientProvider>
    );
};
