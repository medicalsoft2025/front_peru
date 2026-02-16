import { useQuery } from "@tanstack/react-query";
import { MenuService } from "../services/MenuService";
import { Menu } from "../interfaces/models";

export const useMenus = () => {

    const menuService = new MenuService();

    const { data: menus, isLoading, error, refetch } = useQuery<Menu[]>({
        queryKey: ["menus"],
        queryFn: async () => {
            const response = await menuService.withSubmenus();
            const sortMenus = (items: Menu[]): Menu[] => {
                return items.sort((a, b) => (a.order || 0) - (b.order || 0)).map(item => {
                    if (item.items && item.items.length > 0) {
                        return { ...item, items: sortMenus(item.items) };
                    }
                    return item;
                });
            };
            return sortMenus(response.menus);
        },
    });

    return {
        menus,
        isLoading,
        error,
        refetch
    }
}