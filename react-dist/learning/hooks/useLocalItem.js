import { useCallback, useState } from "react";
import { LocalStorageService } from "../services/LocalStorageService.js";
export const useLocalItem = localStorageKey => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const getItem = useCallback(async id => {
    setLoading(true);
    const localStorageService = new LocalStorageService(localStorageKey);
    const fetchedItem = await localStorageService.getItem(id);
    if (fetchedItem) setItem(fetchedItem);
    setLoading(false);
    return fetchedItem;
  }, [localStorageKey]);
  return {
    item,
    getItem,
    setItem,
    loading
  };
};