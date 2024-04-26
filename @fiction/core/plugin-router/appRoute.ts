import type { vue, vueRouter } from '../utils/libraries'
import type { FictionPlugin } from '../plugin'
import { FictionObject } from '../plugin'
import { toLabel } from '../utils/casing'
import type { RouteAuthCallback } from './types'
import type { FictionRouter } from '.'

type IsActiveCallback = (c: {
  route: vueRouter.RouteLocation
  appRoute?: AppRoute<string, vue.Component>
}) => boolean | undefined

export type RouteKeysUnion<T extends AppRoute<string, vue.Component>[]> = {
  [K in keyof T]: T[K] extends AppRoute<infer T, vue.Component> ? T : never
}[number]

type RLoc = vueRouter.RouteLocationNormalized

type ComponentInterface<T> = T extends vue.Component<infer P> ? P : never

export type AppRouteParams<T extends string = string, U extends vue.Component = vue.Component> = {
  name: T
  title?: string
  niceName?: (args: { fictionRouter: FictionRouter }) => string
  path: string
  icon?: string
  isActive?: IsActiveCallback
  parent?: string
  priority?: number
  services?: Record<string, FictionPlugin>
  auth?: RouteAuthCallback
  after?: (args: { fictionRouter: FictionRouter, to: RLoc, from: RLoc }) => Promise<void>
  before?: (args: {
    fictionRouter: FictionRouter
    isSSR: boolean
    to: RLoc
    from: RLoc
    navigate: ReturnType<vueRouter.NavigationGuard>
  }) => Promise<ReturnType<vueRouter.NavigationGuard>>
  meta?: Record<string, unknown>
  props?: ComponentInterface<U>['$props'] | undefined
  component: U
  redirect?: vueRouter.RouteRecordRedirectOption
}
export class AppRoute<T extends string = string, U extends vue.Component = vue.Component> extends FictionObject<AppRouteParams<T, U>> {
  override name = this.settings.name
  title = this.settings.title || toLabel(this.settings.name)
  niceName = this.settings.niceName || (() => toLabel(this.name))
  path = this.settings.path
  icon? = this.settings.icon
  component? = this.settings.component
  isActive? = this.settings.isActive
  meta = this.settings.meta || {}
  parent? = this.settings.parent
  priority = this.settings.priority || this.parent ? 200 : 100
  children: AppRoute<T, U>[] = []
  redirect?: vueRouter.RouteRecordRedirectOption
  services = this.settings.services || {}
  before = this.settings.before
  after = this.settings.after
  auth?: RouteAuthCallback = this.settings.auth
  constructor(params: AppRouteParams<T, U>) {
    super('AppRoute', params)
  }

  toConfig() {
    const fields: Record<string, any> = {
      name: this.name,
      title: this.title,
      niceName: this.niceName,
      path: this.path,
      component: this.component?.name || 'unnamed',
      isActive: this.isActive,
      meta: this.meta,
      parent: this.parent,
      priority: this.priority !== 100 ? this.priority : undefined,
      children: this.children.length ? this.children.map(c => c.toConfig()) : undefined,
      redirect: this.redirect,
    }

    const definedFields = Object.fromEntries(
      Object.entries(fields).filter(([, value]) => value !== undefined),
    )

    return definedFields
  }
}
