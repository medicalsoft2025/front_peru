import { LocalStorageService } from "../services/LocalStorageService.js";
import { useCallback } from "react";
export const useLocalCreate = localStorageKey => {
  const create = useCallback(async data => {
    const localStorageService = new LocalStorageService(localStorageKey);
    await localStorageService.create(data);
  }, [localStorageKey]);
  return {
    create
  };
};