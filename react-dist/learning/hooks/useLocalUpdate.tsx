export const useLocalUpdate = (localStorageKey: string) => {
    const update = (id: string, data: any) => {
        const items = JSON.parse(localStorage.getItem(localStorageKey) || '[]')
        const updatedItems = items.map((item: any) => {
            if (item.id === id) {
                return {
                    ...item,
                    ...data
                }
            }
            return item
        })
        localStorage.setItem(localStorageKey, JSON.stringify(updatedItems))
    }

    return {
        update
    }
}