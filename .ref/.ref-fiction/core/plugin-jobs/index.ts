// @unocss-include

import type {
  FactorApp,
  FactorDb,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'

import type { FactorCache } from '@factor/api/plugin-cache'
import type { TableJobConfig } from '../tables'
import { tables } from '../tables'
import { QueryListJobs, QueryManageJobs } from './endpoint'

export type FictionJobsSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser: FactorUser
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorCache: FactorCache
} & FactorPluginSettings

export class FictionJobs extends FactorPlugin<FictionJobsSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorCache = this.settings.factorCache
  cache = () => this.factorCache.getCache()
  loading = this.utils.vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  isLive = this.factorEnv.isProd
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  activeJobs = this.utils.vue.ref<TableJobConfig[]>([])

  jobKey = (jobId: string) => `job:${jobId}`

  constructor(settings: FictionJobsSettings) {
    super('FictionJobs', settings)

    this.factorApp.addUiPaths([`${this.root}*.vue`, `${this.root}*.ts`])
    this.factorDb.addTables(tables)
    this.pollJobs()
  }

  async requestJobsList() {
    const user = await this.factorUser.userInitialized()
    if (user) {
      const r = await this.requests.ListJobs.projectRequest({
        _action: 'list',
        filters: [],
      })

      this.activeJobs.value = r.data || []
    }
  }

  pollJobs() {
    if (!this.factorEnv.isApp.value)
      return

    this.requestJobsList().catch(console.error)
    setTimeout(async () => {
      this.pollJobs()
    }, 5000)
  }

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      fictionModel: this,
    }
    return {
      ManageJobs: new QueryManageJobs(deps),
      ListJobs: new QueryListJobs(deps),
    } as const
  }
}
