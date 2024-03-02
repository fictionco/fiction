// @unocss-include
import type {
  FactorApp,
  FactorDb,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
  MenuItem,
  vue,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import type { FictionAppStore } from '.'

export type FictionAppSettings = {
  fictionAppStore: FictionAppStore
  factorRouter: FactorRouter
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
} & FactorPluginSettings

export abstract class FictionApp extends FactorPlugin<FictionAppSettings> {
  abstract appId: string
  abstract appName: string
  abstract icon: string
  abstract tagline: string
  abstract version: string
  abstract description: string
  abstract tags: string[]
  abstract actions: (args: { app: FictionApp }) => MenuItem[]
  thumb?: string
  figure?: { component: vue.Component, props?: Record<string, any> }

  fictionAppStore = this.settings.fictionAppStore
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  constructor(name: string, settings: FictionAppSettings) {
    super(name, settings)
  }
}
