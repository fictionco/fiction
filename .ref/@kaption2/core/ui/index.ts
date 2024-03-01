import type {
  FactorApp,
  FactorPluginSettings,
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'

type KaptionUiSettings = {
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorUser: FactorUser
} & FactorPluginSettings

export class KaptionUi extends FactorPlugin<KaptionUiSettings> {
  factorApp = this.settings.factorApp
  factorUser = this.settings.factorUser
  factorRouter = this.settings.factorRouter
  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: KaptionUiSettings) {
    super('kaptionUi', settings)

    this.factorApp.addUiPaths([`${this.root}/*.{ts,vue}`])
  }

  setup = () => {}
}
