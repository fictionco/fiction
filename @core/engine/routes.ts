import type { RouteLocation } from "vue-router"
import type { Component } from "vue"
import { AuthCallback } from "@factor/types"

export type AppRouteParams<T extends string> = {
  key: T
  name: string
  path: string
  icon: string
  component?: () => Promise<Component>
  isActive?: (c: { route: RouteLocation }) => boolean
  meta?: {
    auth: AuthCallback
    [key: string]: unknown
  }
}
export class AppRoute<T extends string> {
  key: T
  name: string
  path: string
  icon: string
  component?: () => Promise<Component>
  isActive?: (c: { route: RouteLocation }) => boolean
  meta?: Record<string, unknown>
  constructor(params: AppRouteParams<T>) {
    const { key, name, path, icon, component, isActive, meta } = params
    this.key = key
    this.name = name
    this.path = path
    this.icon = icon
    this.component = component
    this.isActive = isActive
    this.meta = meta
  }
}
