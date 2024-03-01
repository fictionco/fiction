import type {
  FactorApp,
  FactorPluginSettings,
  FactorRouter,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import type { FactorAdmin, FactorAdminSettings } from '.'

export type AdminPluginSettings = {
  factorAdmin?: FactorAdmin
  factorRouter: FactorRouter
  factorApp: FactorApp
} & FactorAdminSettings & FactorPluginSettings

export class AdminPlugin<T extends AdminPluginSettings = AdminPluginSettings > extends FactorPlugin<T> {
  factorAdmin = this.settings.factorAdmin
  factorRouter = this.settings.factorRouter
  factorApp = this.settings.factorApp
  constructor(name: string, settings: T) {
    super(name, settings)
  }
}
