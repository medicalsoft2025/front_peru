import { generateUUID } from "../../../services/utilidades";
import { BaseEntity } from "../interfaces/types";

export class LocalStorageService<T extends BaseEntity> {

    private localStorageKey: string;

    constructor(localStorageKey: string) {
        this.localStorageKey = localStorageKey;
    }

    create(data: Omit<T, 'id'>) {
        return new Promise<T[]>((resolve) => {
            setTimeout(() => {
                const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]')
                const newItem = {
                    id: generateUUID(),
                    ...data
                }
                items.push(newItem)
                localStorage.setItem(this.localStorageKey, JSON.stringify(items))
                resolve(items)
            }, 1000)
        })
    }

    update = (id: string, data: Partial<T>) => {
        return new Promise<T[]>((resolve) => {
            setTimeout(() => {
                const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]')
                const updatedItems = items.map((item: T) => {
                    if (item.id === id) {
                        return {
                            ...item,
                            ...data
                        }
                    }
                    return item
                })
                localStorage.setItem(this.localStorageKey, JSON.stringify(updatedItems))
                resolve(updatedItems)
            }, 1000)
        })
    }

    getItem = (id: string) => {
        return new Promise<T | undefined>((resolve) => {
            setTimeout(() => {
                const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]')
                const item = items.find((item: T) => item.id === id)
                resolve(item)
            }, 1000)
        })
    }

    getItems = (): Promise<T[]> => {
        return new Promise<T[]>((resolve) => {
            setTimeout(() => {
                const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]')
                resolve(items)
            }, 1000)
        })
    }

    remove = (id: string) => {
        return new Promise<T[]>((resolve) => {
            setTimeout(() => {
                const items = JSON.parse(localStorage.getItem(this.localStorageKey) || '[]')
                const filteredItems = items.filter((item: T) => item.id !== id)
                localStorage.setItem(this.localStorageKey, JSON.stringify(filteredItems))
                resolve(filteredItems)
            }, 1000)
        })
    }
}