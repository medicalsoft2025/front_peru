import { LocalStorageService } from "../services/LocalStorageService";
import { BaseEntity } from "../interfaces/types";
import { useCallback } from "react";

export const useLocalUpdate = <T extends BaseEntity>(localStorageKey: string) => {

    const update = useCallback(async (id: string, data: Partial<T>) => {
        const localStorageService = new LocalStorageService<T>(localStorageKey);
        await localStorageService.update(id, data);
    }, [localStorageKey]);

    return {
        update
    }
}
