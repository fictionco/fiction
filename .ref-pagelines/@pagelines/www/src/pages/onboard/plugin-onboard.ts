// @unocss-include
import type {
  FactorDb,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'

type pageLinesOnboardSettings = {
  factorRouter: FactorRouter
  factorServer: FactorServer
  factorUser: FactorUser
  factorDb: FactorDb
} & FactorPluginSettings

export class pageLinesOnboard extends FactorPlugin<pageLinesOnboardSettings> {
  factorRouter = this.settings.factorRouter
  factorServer = this.settings.factorServer
  factorUser = this.settings.factorUser
  factorDb = this.settings.factorDb
  root = this.utils.safeDirname(import.meta.url)
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  constructor(settings: pageLinesOnboardSettings) {
    super('onboard', settings)
  }

  protected createQueries() {
    const _deps = {
      ...this.settings,
    }
    return {} as const
  }
}
