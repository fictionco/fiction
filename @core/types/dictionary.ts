import type { FullUser, PublicUser } from "./user"
import type { EmailTransactionalConfig } from "./email"
import { App, Component } from "vue"
import { RouteLocationNormalized, RouteRecordRaw } from "vue-router"

import { EndpointConfig } from "./endpoint"
import { PostTypeConfig } from "./postTypes"
/**
 * Look up dictionary for filter/hook types
 */
export interface HookDictionary extends CallbackDictionary {
  routes: RouteRecordRaw[]
  copyFiles: { from: string; to: string }[]
  inputs: Record<string, Component>
  factorSettings: Record<string, any>
  // Localization
  locale: string
  // Customize ElLink Path
  linkPath: string
  sitemaps: { topic: string; paths: string[] }[]

  // PostTypes
  postTypesConfig: PostTypeConfig[]

  // Server / Endpoints
  endpoints: EndpointConfig[]
  endpointErrorMessage: string | undefined

  // email
  transactionalEmail: EmailTransactionalConfig
  transactionalEmailConfig: EmailTransactionalConfig

  // components
  globalComponents: Component[]

  serverPrivateUser: PublicUser

  [key: string]: any
}
/**
 * Callback hook names and arguments provided
 * @note must return array of args
 */
export interface CallbackDictionary {
  appReady: [App]
  userLoaded: [Partial<FullUser>]
  routeQueryAction: [RouteLocationNormalized]
  afterServerSetup: []
  afterServerCreated: []
  [key: string]: any[]
}
