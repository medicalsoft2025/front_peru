import { LocalStorageService } from "../services/LocalStorageService.js";
import { useCallback } from "react";
export const useLocalRemove = localStorageKey => {
  const remove = useCallback(async id => {
    const localStorageService = new LocalStorageService(localStorageKey);
    await localStorageService.remove(id);
  }, [localStorageKey]);
  return {
    remove
  };
};