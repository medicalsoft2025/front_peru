import { generateUUID } from "../../../services/utilidades"

export const useLocalCreate = (localStorageKey: string) => {
    const save = (data: any) => {
        const items = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
        items.push({
            id: generateUUID(),
            ...data
        })
        localStorage.setItem(localStorageKey, JSON.stringify(items))
    }

    return {
        save
    }
}