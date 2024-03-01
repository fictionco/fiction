import { getRouter } from '@factor/api/router'
import type { AuthCallback, MenuItem } from '@factor/types'
import type { Component, ComputedRef } from 'vue'
import { computed } from 'vue'
import type { RouteLocation } from 'vue-router'

import * as admin from '@kaption/app/routes'
import {
  activeOrganization,
  activeProject,
} from '@kaption/engine/activeProject'

export type RouteDictionary<T extends string = string> = Record<
  T,
  RouteMenuItem
>

export type RouteMenuItem = MenuItem & {
  component?: Component
  exactName?: string
  isActive?: (args: { menuItem: MenuItem, route: RouteLocation }) => boolean
  meta?: { auth?: AuthCallback }
}

export type RouteKey = keyof typeof routeDictionary

export type RouteKeyValues = {
  [K in keyof typeof routeDictionary]: K
}

export const routeDictionary = {
  ...admin.routes,
}

export function routeConfig(name: RouteKey): { path: string, name: string, component: Component } {
  const val = routeDictionary[name]

  const { component, path } = val

  if (!component)
    throw new Error(`no component in ${String(name)} route`)

  return { ...val, component, path: path ?? '' }
}

export function currentRouteConfig(): RouteMenuItem | undefined {
  const router = getRouter()
  const routeName = router.currentRoute.value.name
  return Object.values(routeDictionary).find(_ => _.name === routeName)
}

export function routeRaw(name: RouteKey, replace?: Record<string, string>): string {
  const val = routeDictionary[name]

  let rawRoute = typeof val === 'string' ? val : val?.path

  if (!rawRoute)
    throw new Error(`route for ${String(name)} is missing in dictionary`)

  if (replace) {
    Object.entries(replace).forEach(([key, val]) => {
      rawRoute = rawRoute?.replace(key, val)
    })
  }

  return rawRoute
}
/**
 * Gets the computed value, substituting variables for params
 */
export function routeRef(name: RouteKey, replace: Record<string, any> = {}): ComputedRef<string> {
  let r = routeRaw(name)

  Object.entries(replace).forEach(([key, value]) => {
    if (typeof value === 'string')
      r = r.replace(`:${key}`, value)
  })

  return computed<string>(() => {
    if (activeProject.value)
      r = r.replace(':projectId', activeProject.value.projectId)

    if (activeOrganization.value)
      r = r.replace(':organizationId', activeOrganization.value.organizationId)

    return r
  })
}
/**
 * gets route without the computed
 */
export function getRoute(name: RouteKey, replace: Record<string, any> = {}, query?: Record<string, any> | undefined): string {
  const searchParams = query ? `?${new URLSearchParams(query)}` : ''
  const route = routeRef(name, replace).value

  return `${route}${searchParams}`
}
/**
 * Gets a route used for a menu by key
 */
export function menuItemRef(key: RouteKey, replace: Record<string, any> = {}): ComputedRef<MenuItem> {
  const val = routeDictionary[key]
  return computed<MenuItem>(() => {
    return { key, ...val, route: routeRef(key, replace).value }
  })
}
