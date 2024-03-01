// @unocss-include

import type {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import type { FactorCache } from '@factor/api/plugin-cache'
import { QueryManageApps } from './endpoint'
import { getApps } from './apps'

export type NotifyMode = 'full' | 'contextual' | ''

export type FictionAppStoreSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorEmail: FactorEmail
  factorCache: FactorCache
  vapidPublicKey?: string
  vapidPrivateKey?: string
} & FactorPluginSettings

export class FictionAppStore extends FactorPlugin<FictionAppStoreSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorCache = this.settings.factorCache
  factorEmail = this.settings.factorEmail
  loading = this.utils.vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  isLive = this.factorEnv.isProd
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  apps = getApps({ ...this.settings, fictionAppStore: this })

  constructor(settings: FictionAppStoreSettings) {
    super('FictionAppStore', settings)
    this.factorEnv?.uiPaths.push(`${this.root}/*.vue`, `${this.root}/**/*.vue`)
  }

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      factorEmail: this.factorEmail,
      FictionAppStore: this,
    }
    return { ManageApps: new QueryManageApps(deps) } as const
  }
}
