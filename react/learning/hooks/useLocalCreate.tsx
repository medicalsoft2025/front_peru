import { LocalStorageService } from "../services/LocalStorageService";
import { BaseEntity } from "../interfaces/types";
import { useCallback } from "react";

export const useLocalCreate = <T extends BaseEntity>(localStorageKey: string) => {

    const create = useCallback(async (data: Omit<T, 'id'>) => {
        const localStorageService = new LocalStorageService<T>(localStorageKey);
        await localStorageService.create(data);
    }, [localStorageKey]);

    return {
        create
    }
}
