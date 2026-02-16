export const useLocalItems = (localStorageKey: string) => {
    const items = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
    return items
}