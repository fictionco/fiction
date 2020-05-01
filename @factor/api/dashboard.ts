import { pushToFilter } from "@factor/api/hooks"
import { MenuItem } from "@factor/dashboard/menu"

export const addDashboardMenu = (menuConfig: MenuItem): void => {
  const { name, key, location = "dashboard" } = menuConfig
  pushToFilter({
    hook: `${location}-menu`,
    key: key ? key : name,
    item: menuConfig,
  })
}
