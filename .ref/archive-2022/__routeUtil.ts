import type { ComputedRef } from 'vue'
import { computed } from 'vue'
import type { AppRoute, MenuItem } from '@factor/api'
import { getRouter, log } from '@factor/api'
import type { RouteRecordNormalized } from 'vue-router'
import type { CompiledServiceConfig } from '@kaption/app/.factor/config'

import { activeOrganization, activeProject } from './_)_activeProject'

export type RouteKeys = CompiledServiceConfig['routes']

export type MenuLocations =
  | 'primary'
  | 'secondary'
  | 'project'
  | 'organization'
  | 'dashboard'
  | 'help'
  | string

class TheRouteUtil {
  private getRoutes = (): RouteRecordNormalized[] => {
    return getRouter().getRoutes()
  }

  public rawPath(name: RouteKeys, replace?: Record<string, string>): string {
    const val = this.getRoutes().find(r => name === r.name)

    let out = val?.path

    if (!out) {
      log.l({
        context: 'RouteUtil',
        level: 'warn',
        description: `route for ${String(name)} is missing`,
      })
      out = '/'
    }

    if (replace) {
      Object.entries(replace).forEach(([key, val]) => {
        out = out?.replace(key, val)
      })
    }

    return out
  }

  private routeRef(
    name: RouteKeys,
    replace: Record<string, any> = {},
  ): ComputedRef<string> {
    let r = this.rawPath(name)

    Object.entries(replace).forEach(([key, value]) => {
      if (typeof value === 'string')
        r = r.replace(`:${key}`, value)
    })

    return computed<string>(() => {
      if (activeProject.value)
        r = r.replace(':projectId', activeProject.value.projectId)

      if (activeOrganization.value) {
        r = r.replace(
          ':organizationId',
          activeOrganization.value.organizationId,
        )
      }

      return r
    })
  }

  public current(): RouteRecordNormalized | undefined {
    const route = getRouter().currentRoute.value
    return this.getRoutes().find(r => route.name === r.name)
  }

  public to(
    key: RouteKeys,
    replace: Record<string, any> = {},
    query?: Record<string, any> | undefined,
  ): string {
    const searchParams = query ? `?${new URLSearchParams(query)}` : ''
    const route = this.routeRef(key, replace).value

    return `${route}${searchParams}`
  }

  public menuItem(name: RouteKeys): MenuItem {
    const val = this.getRoutes().find(r => name === r.name)

    if (!val)
      throw new Error(`app route for ${String(name)} is missing`)

    const route = getRouter().currentRoute.value

    const isActive = val.meta.isActive as AppRoute<string>['isActive']
    const active = isActive ? isActive({ route }) : route.name === val.name

    return {
      key: val.name as string,
      name: val.meta.niceName as string,
      icon: val.meta.icon as string,
      active,
      route: this.routeRef(name).value,
    }
  }

  public menu(location: MenuLocations): MenuItem[] {
    const items: MenuItem[] = []

    this.getRoutes().forEach((li) => {
      const menus = (li.meta.menus || []) as string[]

      if (menus.includes(location))
        items.push(this.menuItem(li.name as RouteKeys))
    })
    return items
  }
}

export const RouteUtil = new TheRouteUtil()
