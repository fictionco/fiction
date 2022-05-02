import { RouteRecordRedirectOption, RouteLocation } from "vue-router"
import type { Component } from "vue"
import { AuthCallback } from "../plugin-user/types"
import type { FactorPlugin } from "../plugin"
import { toLabel } from "../utils/utils"

type IsActiveCallback = (c: {
  route: RouteLocation
  appRoute?: AppRoute<string>
}) => boolean | undefined

export type RouteKeysUnion<T extends AppRoute<string>[]> = {
  [K in keyof T]: T[K] extends AppRoute<infer T> ? T : never
}[number]

export type AppRouteParams<T extends string> = {
  name: T
  niceName?: string
  path: string
  icon?: string
  menus?: string[]
  isActive?: IsActiveCallback
  parent?: string
  priority?: number
  services?: Record<string, FactorPlugin>
  meta?: {
    auth: AuthCallback
    [key: string]: unknown
  }
} & (
  | { external: true; component?: undefined }
  | { component: (() => Promise<Component>) | Component; external?: undefined }
)
export class AppRoute<T extends string> {
  name: T
  niceName: string
  path: string
  menus: string[]
  icon?: string
  component?: (() => Promise<Component>) | Component
  isActive?: IsActiveCallback
  meta?: Record<string, unknown>
  parent?: string
  priority: number
  children: AppRoute<T>[] = []
  external?: boolean
  redirect?: RouteRecordRedirectOption
  services: Record<string, FactorPlugin>
  constructor(params: AppRouteParams<T>) {
    const {
      name,
      niceName,
      path,
      icon,
      component,
      isActive,
      meta,
      parent,
      priority,
      external,
      menus,
    } = params
    this.name = name
    this.niceName = niceName || toLabel(name)
    this.path = path
    this.icon = icon
    this.component = component
    this.isActive = isActive
    this.meta = meta
    this.parent = parent
    this.external = external
    this.priority = priority ? priority : parent ? 200 : 100
    this.menus = menus || []
    this.services = params.services || {}
  }
}
