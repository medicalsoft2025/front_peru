import { MenuService } from "../services/MenuService.js";
import { usePRToast } from "../../hooks/usePRToast.js";
export const useMenuSave = () => {
  const menuService = new MenuService();
  const {
    showSuccessToast,
    showServerErrorsToast,
    toast
  } = usePRToast();
  const saveMenus = async menus => {
    try {
      const response = await menuService.save(menus);
      showSuccessToast({
        message: "Menús guardados correctamente"
      });
      return response;
    } catch (error) {
      showServerErrorsToast(error);
    }
  };
  return {
    saveMenus,
    toast
  };
};