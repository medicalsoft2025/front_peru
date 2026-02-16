import { useCallback, useState } from "react"
import { LocalStorageService } from "../services/LocalStorageService";
import { BaseEntity } from "../interfaces/types";

export const useLocalItem = <T extends BaseEntity>(localStorageKey: string) => {

    const [item, setItem] = useState<T | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const getItem = useCallback(async (id: string) => {
        setLoading(true)
        const localStorageService = new LocalStorageService<T>(localStorageKey);
        const fetchedItem = await localStorageService.getItem(id)
        if (fetchedItem) setItem(fetchedItem)
        setLoading(false)
        return fetchedItem
    }, [localStorageKey])

    return { item, getItem, setItem, loading }
}
