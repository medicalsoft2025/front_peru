import { useEffect, useState, useCallback } from "react";
import { LocalStorageService } from "../services/LocalStorageService.js";
export const useLocalItems = localStorageKey => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const getItems = useCallback(async () => {
    setLoading(true);
    const localStorageService = new LocalStorageService(localStorageKey);
    const fetchedItems = await localStorageService.getItems();
    setItems(fetchedItems);
    setLoading(false);
  }, [localStorageKey]);

  // We don't auto-fetch in the hook unless explicitly desired, but standard pattern often does.
  // Given the context usually calls getItems manually, we can keep it optional or auto-load.
  // For standalone usage, auto-loading is usually expected.
  useEffect(() => {
    getItems();
  }, [getItems]);
  return {
    items,
    loading,
    getItems
  };
};