import type {
  FactorApp,
  FactorPluginSettings,
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import type { FactorAdmin } from '@factor/api/plugin-admin'

type KaptionCoreUiSettings = {
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorUser: FactorUser
  factorAdmin?: FactorAdmin
} & FactorPluginSettings

export class KaptionCoreUi extends FactorPlugin<KaptionCoreUiSettings> {
  factorApp = this.settings.factorApp
  factorUser = this.settings.factorUser
  factorAdmin = this.settings.factorAdmin
  factorRouter = this.settings.factorRouter
  root = this.utils.safeDirname(import.meta.url)

  constructor(settings: KaptionCoreUiSettings) {
    super('kaptionUi', settings)

    this.factorApp.addUiPaths([`${this.root}/*.{ts,vue}`])
  }

  setup = () => {}
}
