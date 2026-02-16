import { useMutation } from "@tanstack/react-query";
import { MenuService } from "../services/MenuService";
import { usePRToast } from "../../hooks/usePRToast";

export const useMenuSave = () => {
    const menuService = new MenuService();

    const { showSuccessToast, showServerErrorsToast, toast } = usePRToast();

    const saveMenus = async (menus: any[]) => {
        try {
            const response = await menuService.save(menus);
            showSuccessToast({ message: "Menús guardados correctamente" });
            return response;
        } catch (error) {
            showServerErrorsToast(error);
        }
    }

    return {
        saveMenus,
        toast
    }
}