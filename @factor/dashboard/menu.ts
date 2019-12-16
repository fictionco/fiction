import { applyFilters } from "@factor/api"
import { getDashboardRoute } from "."
export interface MenuItem {
  name: string;
  group?: string;
  path?: string;
  icon?: string;
  key?: string;
  click?: Function;
  items?: MenuItem[];
  active: boolean;
  priority?: number;
  query?: Record<string, any>;
}

/**
 * Returns an object containing the dashboard menu areas with menu arrays
 * @param currentPath - The currently active route path. Used to determine active menu items.
 */
export const getDashboardMenu = (currentPath: string): Record<string, MenuItem[]> => {
  const menuAreas = ["dashboard", "admin", "account"]

  const menu: Record<string, MenuItem[]> = {}
  menuAreas.forEach(area => {
    const parentMenu = applyFilters(`${area}-menu`, [])
    menu[area] = parentMenu.map((menuItem: MenuItem) => {
      const parentPath = getDashboardRoute(menuItem.path)
      const icon = menuItem.icon ? menuItem.icon : require("./theme/img/generic.svg")
      let active = parentPath == currentPath
      const subMenu = applyFilters(`${area}-menu-${menuItem.group}`, menuItem.items || [])
      const items = subMenu.map((menuItem: MenuItem) => {
        const subPath = getDashboardRoute(menuItem.path, parentPath)
        const subActive = subPath == currentPath
        if (subActive) active = subActive
        return { ...menuItem, path: subPath, active: subActive }
      })

      return { ...menuItem, icon, active, path: parentPath, items }
    })
  })

  return menu
}
