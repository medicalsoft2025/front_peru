import { useEffect, useState, useCallback } from "react"
import { LocalStorageService } from "../services/LocalStorageService";
import { BaseEntity } from "../interfaces/types";

export const useLocalItems = <T extends BaseEntity>(localStorageKey: string) => {

    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const getItems = useCallback(async () => {
        setLoading(true)
        const localStorageService = new LocalStorageService<T>(localStorageKey);
        const fetchedItems = await localStorageService.getItems();
        setItems(fetchedItems)
        setLoading(false)
    }, [localStorageKey])

    // We don't auto-fetch in the hook unless explicitly desired, but standard pattern often does.
    // Given the context usually calls getItems manually, we can keep it optional or auto-load.
    // For standalone usage, auto-loading is usually expected.
    useEffect(() => {
        getItems()
    }, [getItems])

    return {
        items,
        loading,
        getItems
    }
}
