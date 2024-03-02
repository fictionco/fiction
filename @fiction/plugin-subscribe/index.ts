import type {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
} from '@fiction/core'
import {
  FactorPlugin,
} from '@fiction/core'
import type { FactorMonitor } from '@fiction/plugin-monitor'
import { table } from './tables'
import { QueryManageSubscribe } from './endpoint'

export * from './tables'

type FactorSubscribeSettings = {
  factorDb: FactorDb
  factorServer: FactorServer
  factorEmail: FactorEmail
  factorEnv: FactorEnv
  factorApp: FactorApp
  factorUser: FactorUser
  factorRouter: FactorRouter
  factorMonitor: FactorMonitor
} & FactorPluginSettings

export class FactorSubscribe extends FactorPlugin<FactorSubscribeSettings> {
  root = this.utils.safeDirname(import.meta.url)
  factorDb = this.settings.factorDb
  factorServer = this.settings.factorServer
  factorUser = this.settings.factorUser
  factorRouter = this.settings.factorRouter
  factorApp = this.settings.factorApp
  factorEnv = this.settings.factorEnv
  factorMonitor = this.settings.factorMonitor
  factorEmail = this.settings.factorEmail
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  constructor(settings: FactorSubscribeSettings) {
    super('FactorSubscribe', settings)
    settings.factorEnv?.uiPaths.push(`${this.root}/*.vue`)
    this.factorDb?.addTables([table])
  }

  async subscribeEmail(args: { email: string }) {
    const { email } = args

    const result = await this.requests.ManageSubscribe.request({
      _action: 'init',
      email,
    })

    return result
  }

  protected createQueries() {
    const deps = {
      factorUser: this.factorUser,
      factorSubscribe: this,
      factorDb: this.factorDb,
      factorEnv: this.factorEnv,
      factorMonitor: this.factorMonitor,
      factorEmail: this.factorEmail,
    }
    return {
      ManageSubscribe: new QueryManageSubscribe(deps),
    } as const
  }
}
