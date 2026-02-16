import React from "react";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { persistOptions } from "../config/queryClientPersistence.js"; // Extend Window interface to include globalQueryClient
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
export const PersistentQueryProvider = ({
  children
}) => {
  const queryClient = window.globalQueryClient;
  if (!queryClient) {
    console.error('❌ Global QueryClient not found. Make sure menu.php has initialized it.');
    return /*#__PURE__*/React.createElement("div", null, "Error: QueryClient not initialized");
  }
  return /*#__PURE__*/React.createElement(PersistQueryClientProvider, {
    client: queryClient,
    persistOptions: persistOptions
  }, children);
};