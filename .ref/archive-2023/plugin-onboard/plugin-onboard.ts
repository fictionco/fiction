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

type factorOnboardSettings = {
  factorRouter: FactorRouter
  factorServer: FactorServer
  factorUser: FactorUser
  factorDb: FactorDb
} & FactorPluginSettings

export class factorOnboard extends FactorPlugin<factorOnboardSettings> {
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

  constructor(settings: factorOnboardSettings) {
    super('onboard', settings)
  }
}
