import type { MenuGroup, MenuItem } from '@factor/api'
import { computed } from 'vue'
import type { MenuLocations } from '@kaption/core/routeUtil'
import { RouteUtil } from '@kaption/core/routeUtil'

import { useKaptionService } from '@kaption/core/utilsges/core/utils'

const { factorUser, kaptionAdmin } = useKaptionService()

export function getAccountMenu(): MenuItem[] {
  return [
    {
      name: 'Account Settings',
      path: RouteUtil.to('accountSettings'),
      route: RouteUtil.to('accountSettings'),
    },
    {
      name: 'Logout',
      onClick: async (): Promise<void> => {
        await factorUser.logout()
      },
    },
  ]
}

export const activeProjectMenu = computed<MenuGroup[]>(() => {
  return [
    {
      groupName: 'Projects',
      menu: kaptionAdmin.activeUserProjects.value,
    },
  ]
})

export const activeMenus = computed<Record<MenuLocations, MenuItem[]>>(() => {
  return {
    primary: RouteUtil.menu('primary'),
    secondary: RouteUtil.menu('secondary'),
    project: RouteUtil.menu('project'),
    organization: RouteUtil.menu('organization'),
    dashboard: RouteUtil.menu('dashboard'),
    help: RouteUtil.menu('help'),
  }
})
