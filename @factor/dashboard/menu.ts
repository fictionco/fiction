import { applyFilters, slugify } from "@factor/api"
import { userInitialized, userCan } from "@factor/user"
import { RouteConfig } from "vue-router"
import { currentRoute } from "@factor/app/router"
import { MenuItem, MenuGroup } from "@factor/ui/dashboard/types"
import { getDashboardRoute } from "@factor/api/dashboard"
import genericIcon from "./theme/img/generic.svg"

const setMenuState = (area: MenuGroup): MenuGroup => {
  const { path } = currentRoute() ?? {}

  const menuWithState = area.menu.map((menuItem: MenuItem) => {
    const items = menuItem.items || []
    let active = menuItem.path == path
    const subItems = items.map((sub: MenuItem) => {
      const subActive = sub.path == path
      if (subActive) {
        active = true
      }

      return { ...sub, active: subActive }
    })

    return { ...menuItem, active, items: subItems }
  })

  return { ...area, menu: menuWithState }
}

const loadMenuGroups = (): MenuGroup[] => {
  let groups: MenuGroup[] = []

  groups.push({ group: "site", hideTitle: true, menu: applyFilters(`site-menu`, []) })

  groups.push({ group: "dashboard", menu: applyFilters(`dashboard-menu`, []) })

  groups.push({ group: "admin", menu: applyFilters(`admin-menu`, []) })

  groups.push({ group: "development", menu: applyFilters(`development-menu`, []) })

  groups = groups.map((menuGroup: MenuGroup) => {
    menuGroup.menu = menuGroup.menu.map((menuItem: MenuItem) => {
      const { name, path, group, icon, items = [], children = [] } = menuItem
      const parentPath = getDashboardRoute(path)

      const allSubItems = [...items, ...children]

      const filteredSub = allSubItems
        .map((item: MenuItem) => {
          return { ...item, path: getDashboardRoute(item.path, parentPath) }
        })
        .filter((item) => {
          return item.path != parentPath
        })

      const subMenuId = group || slugify(name)

      const subItems = applyFilters(`${menuGroup.group}-menu-${subMenuId}`, filteredSub)

      return {
        ...menuItem,
        icon: icon ? icon : genericIcon,
        path: parentPath,
        items: subItems,
      }
    })

    return menuGroup
  })

  return groups
}

export const preloadedDashboardRoutes = (): RouteConfig[] => {
  const routes: RouteConfig[] = []
  const groups: MenuGroup[] = loadMenuGroups()

  groups
    .map((g) => g.menu)
    .forEach((menuItems: MenuItem[]) => {
      menuItems.forEach((menu: MenuItem) => {
        const { component, meta, path, children = [] } = menu
        if (component && path) {
          routes.push({ component, path, meta, children })
        }
        if (menu.items) {
          menu.items.forEach((sub: MenuItem) => {
            const { component: sc, meta: sm, path: sp, children: subChildren = [] } = sub
            if (sc && sp) {
              routes.push({ component: sc, path: sp, meta: sm, children: subChildren })
            }
          })
        }
      })
    })

  return routes
}

/**
 * Returns an object containing the dashboard menu areas with menu arrays
 * @param currentPath - The currently active route path. Used to determine active menu items.
 */
export const getDashboardMenu = async (): Promise<MenuGroup[]> => {
  await userInitialized()

  let groups: MenuGroup[] = loadMenuGroups()

  groups = groups.filter((group) => {
    if (group.group == "admin" && !userCan({ accessLevel: 100 })) {
      return false
    } else if (group.group == "development" && process.env.NODE_ENV !== "development") {
      return false
    } else {
      return true
    }
  })

  return applyFilters("manager-menus", groups).map((group) => setMenuState(group))
}

export const dashboardSiteMenu = (currentPath: string, menuType: string): MenuItem[] => {
  let items: MenuItem[] = []

  if (menuType == "app") {
    items = [
      {
        name: "Visit Site &rarr;",
        path: "/",
      },
    ]
  } else {
    items = [
      {
        name: "Documentation",
        path: "https://factor.dev",
      },
      {
        name: "Community",
        path: "https://link.fiction.com/slack",
      },
      {
        name: "Support",
        path: "https://link.fiction.com/slack",
      },
    ]
  }

  return items.map((el) => {
    return { ...el, active: el.path == currentPath }
  })
}
