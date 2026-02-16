import BaseApiService from "./baseApiService";
import { UserService } from "./userService";

export class MenuService extends BaseApiService {
    async getAll() {
        try {
            const response = await this.httpClient.get(
                `${this.microservice}medical/menus/submenus`
            );
            const allChildItems = [];

            function extractChildren(items) {
                if (!items || !Array.isArray(items)) return;

                items.forEach((item) => {
                    if (item.items && item.items.length > 0) {
                        extractChildren(item.items);
                    }
                    if (item.parent_id !== null) {
                        allChildItems.push({
                            id: item.id,
                            name: item.label,
                            items: item.key,
                            route: item.url || null,
                            is_active: false,
                        });
                    }
                });
            }

            if (response.menus && Array.isArray(response.menus)) {
                response.menus.forEach((menu) => {
                    if (menu.items && menu.items.length > 0) {
                        extractChildren(menu.items);
                    }
                });
            }

            return allChildItems;
        } catch (error) {
            console.error("Error fetching menu by permission:", error);
            throw error;
        }
    }

    async getAllMenuByRolePermissions(roleId) {
        try {
            const response = await this.httpClient.get(
                `medical/roles/${roleId}/menus`
            );
            return response.menus || [];
        } catch (error) {
            console.error("Error fetching menu by permission:", error);
            throw error;
        }
    }

    async getAllMenuByRole() {
        try {
            const response = await this.httpClient.get(
                `${this.microservice}medical/menus/submenus`
            );
            return response.menus || [];
        } catch (error) {
            console.error("Error fetching menu by permission:", error);
            throw error;
        }
    }

    async getAllMenu() {
        const userService = new UserService("medical", "users");
        const dataUser = await userService.getCachedLoggedUser();
        const cachedMenu = localStorage.getItem("menus");
        let menus = JSON.parse(cachedMenu);

        if (!cachedMenu) {
            try {
                menus = await this.httpClient.get(
                    `medical/menus/permissions/${dataUser.user_role_id}`
                );
                localStorage.setItem("menus", JSON.stringify(menus));
                return menus;
            } catch (error) {
                console.error("Error fetching all menus:", error);
                throw error;
            }
        }

        return { menus };
    }

    async getAllMenuForRQ() {
        const userService = new UserService("medical", "users");
        const dataUser = await userService.getCachedLoggedUser();

        try {
            const menus = await this.httpClient.get(
                `medical/menus/permissions/${dataUser.user_role_id}`
            );
            return { menus };
        } catch (error) {
            console.error("Error fetching all menus:", error);
            throw error;
        }
    }
}
