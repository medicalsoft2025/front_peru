export const useLocalItem = (localStorageKey: string, id: string) => {
    const item = JSON.parse(localStorage.getItem(localStorageKey) || '[]').find((item: any) => item.id === id)
    return item
}