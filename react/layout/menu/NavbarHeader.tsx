import { Menubar } from "primereact/menubar";
import React from "react";
import { navbarMenuStyle } from "./styles/navBarMegaMenu";
import { useMenuItems } from "./hooks/useMenuItems";
import NavbarSkeleton from "../skeleton/NavbarSkeleton";
import { MenuItem } from "primereact/menuitem";

const NavbarHeader = () => {
    const { menuItems: menuItemsFromHook, loading } = useMenuItems();

    const iconTemplate = (iconClass) => {
        return iconClass ? <i className={iconClass}></i> : null;
    };

    const processItems = (items) => {
        if (!items || !Array.isArray(items)) return [];

        return items.map((item) => {
            const processedItem: MenuItem = {
                label: item.label,
                url: item.url,
            };

            if (item.dynamic_form_id) {
                processedItem.url = `appFormsCrud?dynamic_form_id=${item.dynamic_form_id}`;
            }

            if (item.icon) {
                processedItem.icon = () => iconTemplate(item.icon);
            }

            if (item.items && item.items.length > 0) {
                processedItem.items = processItems(item.items);
            }

            return processedItem;
        });
    };

    const processedItems = processItems(menuItemsFromHook);

    console.log("Processed Menus", processedItems);

    if (loading) {
        return <NavbarSkeleton />;
    }

    return (
        <>
            <Menubar
                model={processedItems}
                className="custom-responsive-megamenu"
            />
            <style>{navbarMenuStyle}</style>
        </>
    );
};

export default NavbarHeader;
