import { setting } from "@factor/api/settings"

/**
 * The base route for the dashboard
 */
export const dashboardBaseRoute = (): string => {
  const dashboardRoute = setting("dashboard.route")

  if (!dashboardRoute) {
    throw new Error(
      "Dashboard settings are missing. There may be a problem with settings generation; check the files in your '.factor' folder."
    )
  }
  return dashboardRoute
}

export const getDashboardRoute = (path?: string, parentPath?: string): string => {
  const base = parentPath ? parentPath : dashboardBaseRoute()
  const p = path || ""
  if (!path || path.startsWith("/")) {
    return `${base}${p}`
  } else {
    return `${base}/${p}`
  }
}
