import { applyFilters } from "@factor/api"
import { userInitialized, userCan } from "@factor/user"
import { currentRoute } from "@factor/app/router"
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

export type MenuAreaName = "admin" | "dashboard" | "development"

export interface MenuArea {
  name: MenuAreaName;
  menu: MenuItem[];
}

const setMenu = (area: MenuAreaName): MenuArea => {
  const rawMenu: MenuItem[] = applyFilters(`${area}-menu`, [])
  const { path } = currentRoute()

  const menu = rawMenu.map((menuItem: MenuItem) => {
    const parentPath = getDashboardRoute(menuItem.path)

    const subMenu = applyFilters(`${area}-menu-${menuItem.group}`, menuItem.items || [])

    let active = parentPath == path
    const items = subMenu.map((sub: MenuItem) => {
      const subPath = getDashboardRoute(sub.path, parentPath)

      const subActive = subPath == path
      if (subActive) {
        active = true
      }

      return { ...sub, path: subPath, active: subActive }
    })

    return {
      ...menuItem,
      icon: menuItem.icon ? menuItem.icon : require("./theme/img/generic.svg"),
      active,
      path: parentPath,
      items
    }
  })

  return { name: area, menu }
}

/**
 * Returns an object containing the dashboard menu areas with menu arrays
 * @param currentPath - The currently active route path. Used to determine active menu items.
 */
export const getDashboardMenu = async (): Promise<MenuArea[]> => {
  await userInitialized()

  const menuAreas: MenuArea[] = []

  menuAreas.push(setMenu("dashboard"))

  if (userCan({ accessLevel: 100 })) {
    menuAreas.push(setMenu("admin"))
  }

  if (process.env.NODE_ENV == "development") {
    menuAreas.push(setMenu("development"))
  }

  return menuAreas
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
