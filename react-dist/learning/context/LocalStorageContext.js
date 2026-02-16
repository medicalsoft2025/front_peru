import { createContext, useContext } from "react";
// Create a generic context
// Note: React.createContext cannot be generic in the way we want for the default value
// We will cast it when using the hook
export const LocalStorageContext = /*#__PURE__*/createContext(undefined);
export const useLocalStorageContext = () => {
  const context = useContext(LocalStorageContext);
  if (!context) {
    throw new Error("useLocalStorageContext must be used within LocalStorageProvider");
  }
  return context;
};