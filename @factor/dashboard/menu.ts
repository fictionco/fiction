import { applyFilters } from "@factor/api"
import { userInitialized, userCan } from "@factor/user"
import { getDashboardRoute } from "."
export interface MenuItem {
  name: string;
  group?: string;
  path?: string;
  icon?: string;
  key?: string;
  click?: Function;
  items?: MenuItem[];
  active?: boolean;
  priority?: number;
  query?: Record<string, any>;
  accessLevel?: number;
}

/**
 * Returns an object containing the dashboard menu areas with menu arrays
 * @param currentPath - The currently active route path. Used to determine active menu items.
 */
export const getDashboardMenu = async (
  currentPath: string
): Promise<Record<string, MenuItem[]>> => {
  await userInitialized()

  const menuAreas = ["dashboard", "account", "action"]

  if (userCan({ accessLevel: 100 })) {
    menuAreas.push("admin")
  }

  const menu: Record<string, MenuItem[]> = {}
  menuAreas.forEach(area => {
    const parentMenu: MenuItem[] = applyFilters(`${area}-menu`, [])

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

export const dashboardSiteMenu = (currentPath: string, menuType: string): MenuItem[] => {
  let items: MenuItem[] = []

  if (menuType == "app") {
    items = [
      {
        name: "Visit Site &rarr;",
        path: "/"
      }
    ]
  } else {
    items = [
      {
        name: "Documentation",
        path: "https://factor.dev"
      },
      {
        name: "Community",
        path: "https://link.fiction.com/slack"
      },
      {
        name: "Support",
        path: "https://link.fiction.com/slack"
      }
    ]
  }

  return items.map(el => {
    return { ...el, active: el.path == currentPath }
  })
}
