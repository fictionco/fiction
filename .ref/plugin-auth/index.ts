import type { FactorPluginSettings } from '../plugin'
import { FactorPlugin } from '../plugin'
import type { FactorRouter } from '../plugin-router'
import type { FactorUser } from '../plugin-user'
import type { FactorApp } from '../plugin-app'
import type { vue } from '../utils'
import routes from './routes'

type FactorAuthSettings = {
  factorUser: FactorUser
  factorRouter: FactorRouter
  factorApp: FactorApp
  logoComponent?: vue.Component
  termsUrl: string
  privacyUrl: string
} & FactorPluginSettings

export class FactorAuth extends FactorPlugin<FactorAuthSettings> {
  factorUser = this.settings.factorUser
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter

  root = this.utils.safeDirname(import.meta.url)
  logoComponent = this.settings.logoComponent
  termsUrl = this.settings.termsUrl
  privacyUrl = this.settings.privacyUrl
  constructor(settings: FactorAuthSettings) {
    super('auth', settings)
    this.factorRouter.update(routes)
    this.factorEnv?.uiPaths.push(`${this.root}/*.vue`)
  }
}
