import { pushToFilter } from "@factor/api/hooks"

import { MenuItem } from "@factor/ui/dashboard/types"
import { setting } from "@factor/api/settings"

export const addDashboardMenu = (menuConfig: MenuItem): void => {
  const { name, key, location = "dashboard" } = menuConfig
  pushToFilter({
    hook: `${location}-menu`,
    key: key ? key : name,
    item: menuConfig,
  })
}

/**
 * The base route for the dashboard
 */
export const dashboardBaseRoute = (): string => {
  const dashboardRoute = setting("dashboard.route") ?? "/"

  return dashboardRoute
}

export const getDashboardRoute = (path?: string, parentPath?: string): string => {
  const base = parentPath ? parentPath : dashboardBaseRoute()
  const p = path || ""
  let out
  if (!path || path.startsWith("/")) {
    out = `${base}${p}`
  } else {
    out = `${base}/${p}`
  }

  // Remove trailing slash and double slash
  out = out.replace(/\/$/, "").replace(/\/\//g, "/")

  return out
}
