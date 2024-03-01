import type {
  FactorApp,
  FactorDb,
  FactorEmail,
  FactorEnv,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import type { FactorMonitor } from '@factor/plugin-monitor'
import type { TableSubmissionConfig } from './tables'
import { table } from './tables'
import { QueryManageSubmission } from './endpoint'

export * from './tables'
type FactorContactSettings = {
  factorDb: FactorDb
  factorServer: FactorServer
  factorEmail: FactorEmail
  factorEnv: FactorEnv
  factorApp: FactorApp
  factorUser: FactorUser
  factorRouter: FactorRouter
  factorMonitor: FactorMonitor
} & FactorPluginSettings

export class FactorContact extends FactorPlugin<FactorContactSettings> {
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

  constructor(settings: FactorContactSettings) {
    super('FactorContact', settings)
    settings.factorEnv?.addUiPaths([`${this.root}/*.vue`])
    this.factorDb?.addTables([table])
  }

  async submitForm(args: { submission: Partial<TableSubmissionConfig> }) {
    const { submission } = args
    const s: Partial<TableSubmissionConfig> = {
      appUrl: this.factorRouter.current.value.fullPath,
      appName: this.factorApp.appName,
      notificationEmail: this.factorApp.appEmail,
      ...submission,
    }

    const result = await this.requests.ManageSubmission.request({
      _action: 'create',
      submission: s,
    })

    return result
  }

  protected createQueries() {
    const deps = {
      factorUser: this.factorUser,
      factorContact: this,
      factorDb: this.factorDb,
      factorEnv: this.factorEnv,
      factorMonitor: this.factorMonitor,
      factorEmail: this.factorEmail,
    }
    return {
      ManageSubmission: new QueryManageSubmission(deps),
    } as const
  }
}
