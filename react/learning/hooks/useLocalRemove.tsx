import { LocalStorageService } from "../services/LocalStorageService";
import { BaseEntity } from "../interfaces/types";
import { useCallback } from "react";

export const useLocalRemove = <T extends BaseEntity>(localStorageKey: string) => {

    const remove = useCallback(async (id: string) => {
        const localStorageService = new LocalStorageService<T>(localStorageKey);
        await localStorageService.remove(id);
    }, [localStorageKey]);

    return {
        remove
    }
}
