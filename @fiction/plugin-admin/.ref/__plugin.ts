import type {
  FictionApp,
  FictionPluginSettings,
  FictionRouter,
} from '@fiction/core'
import {
  FictionPlugin,
} from '@fiction/core'
import type { FictionAdmin, FictionAdminSettings } from '..'

export type AdminPluginSettings = {
  fictionAdmin?: FictionAdmin
  fictionRouter: FictionRouter
  fictionApp: FictionApp
} & FictionAdminSettings & FictionPluginSettings

export class AdminPlugin<T extends AdminPluginSettings = AdminPluginSettings > extends FictionPlugin<T> {
  fictionAdmin = this.settings.fictionAdmin
  fictionRouter = this.settings.fictionRouter
  fictionApp = this.settings.fictionApp
  constructor(name: string, settings: T) {
    super(name, settings)
  }
}
