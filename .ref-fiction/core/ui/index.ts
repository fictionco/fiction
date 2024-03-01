import type {
  FactorApp,
  FactorPluginSettings,
  FactorRouter,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'

type FictionUiSettings = {
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorUser: FactorUser
} & FactorPluginSettings

export class FictionUi extends FactorPlugin<FictionUiSettings> {
  factorApp = this.settings.factorApp
  factorUser = this.settings.factorUser
  factorRouter = this.settings.factorRouter
  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: FictionUiSettings) {
    super('kaptionUi', settings)

    this.factorApp.addUiPaths([`${this.root}/*.{ts,vue}`])
  }

  setup = () => {}
}
