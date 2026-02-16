import { LocalStorageService } from "../services/LocalStorageService.js";
import { useCallback } from "react";
export const useLocalUpdate = localStorageKey => {
  const update = useCallback(async (id, data) => {
    const localStorageService = new LocalStorageService(localStorageKey);
    await localStorageService.update(id, data);
  }, [localStorageKey]);
  return {
    update
  };
};