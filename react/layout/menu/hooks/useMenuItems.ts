import { menuService } from "../../../../services/api";
import { useQuery } from "@tanstack/react-query";

const sortMenus = (menus: any[]): any[] => {
  return menus
    .sort((a, b) => (a.order || 0) - (b.order || 0))
    .map((item) => {
      if (item.items && item.items.length > 0) {
        return { ...item, items: sortMenus(item.items) };
      }
      return item;
    });
};

export const useMenuItems = () => {
  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["logged-user-menus"],
    queryFn: () => menuService.getAllMenuForRQ(),
    placeholderData: { menus: [] },
    select: (data) => {
      const menus = data?.menus?.menus || [];
      return sortMenus(menus);
    }
  })

  return { menuItems: data || [], loading: isLoading || isFetching, refetch };
};
