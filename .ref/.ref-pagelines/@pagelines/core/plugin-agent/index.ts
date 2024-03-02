// @unocss-include

import type {
  DataFilter,
  FactorApp,
  FactorDb,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
  FactorUser,
  IndexMeta,
} from '@factor/api'
import {
  FactorPlugin,
  vars,
} from '@factor/api'
import type { FactorStripe } from '@factor/plugin-stripe'
import { tables } from '../tables'
import type { PageLinesData } from '../plugin-data'
import type { PageLinesTag } from '../plugin-tag'
import {
  QueryManageAgent,
  QueryManageAgentIndex,
  QueryManageDataSource,
  QueryManageMessage,
  QueryPublicAgent,
} from './endpoint'
import { ChatAgent } from './obj'
import { routes } from './routes'

export { ChatAgent }

vars.register(() => [])

export interface PushNotification {
  title: string
  body: string
  icon?: string
  url?: string
}

export type PageLinesAgentSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser?: FactorUser
  factorApp: FactorApp
  factorRouter: FactorRouter
  factorStripe?: FactorStripe
  pageLinesData: PageLinesData
  pageLinesTag?: PageLinesTag
  liveBaseUrl: string
} & FactorPluginSettings

export class PageLinesAgent extends FactorPlugin<PageLinesAgentSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  factorStripe = this.settings.factorStripe
  pageLinesData = this.settings.pageLinesData
  pageLinesTag = this.settings.pageLinesTag
  loading = this.utils.vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  isLive = this.factorEnv.isProd
  liveBaseUrl = this.settings.liveBaseUrl
  editEmbedUrl = this.utils.vue.computed(() => {
    return `${this.factorApp?.appUrl.value}/visualizer-agent`
  })

  baseUrl = this.utils.vue.computed(() => {
    const isLive = this.factorEnv.isProd?.value || false
    return isLive && this.liveBaseUrl
      ? this.liveBaseUrl
      : `${this.factorApp?.appUrl.value}/visualizer-agent`
  })

  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  activeAgent = this.utils.vue.shallowRef<ChatAgent>()

  usageLimits = this.utils.vue.computed(() => {
    const customer = this.factorStripe?.activeCustomer.value
    const tier = customer?.tier || 0
    const characters
      = tier >= 40
        ? 11_000_000
        : tier >= 30
          ? 6_000_000
          : tier >= 20
            ? 4_000_000
            : tier >= 10
              ? 2_000_000
              : 300_000

    return { characters, customer }
  })

  constructor(settings: PageLinesAgentSettings) {
    super('PageLinesAgent', settings)

    this.factorDb.addTables(tables)
    this.factorRouter.update(routes())
    this.factorEnv?.addUiPaths([`${this.root}/*.vue`, `${this.root}/**/*.vue`])

    this.pageLinesTag?.addHook({
      hook: 'tagSettings',
      callback: async (tagSettings) => {
        const {
          organization: { organizationId },
        } = tagSettings
        const r = await this.queries.ManageIndex.serve(
          { _action: 'list', limit: 400, organizationId },
          { server: true },
        )

        tagSettings.agents = r.data || []
        tagSettings.agentBaseUrl = this.baseUrl.value

        return tagSettings
      },
    })
  }

  activeAgentId = this.utils.vue.computed(() => {
    return this.factorRouter.params.value.agentId as string
  })

  getVisualizerAgentUrl = (agentId?: string) => {
    return `/visualizer-agent/${agentId}`
  }

  visualizerUrl = this.utils.vue.computed(() => {
    const u = new URL(this.factorApp.appUrl.value)
    u.pathname = `/visualizer-embed/${this.activeAgentId.value}`
    return u.toString()
  })

  async findOne(args: { agentId: string }): Promise<ChatAgent | undefined> {
    const { agentId } = args
    const r = await this.requests.PublicAgent.request({
      _action: 'retrieve',
      agentId,
    })

    return r.data
      ? new ChatAgent({ ...r.data, pageLinesAgent: this })
      : undefined
  }

  async requestIndex(
    args: {
      limit?: number
      offset?: number
      filters?: DataFilter[]
      imageId?: string
    } = {},
  ): Promise<{ items: ChatAgent[] | undefined, indexMeta?: IndexMeta }> {
    const { limit = 10, offset = 0 } = args || {}

    const r = await this.requests.ManageIndex.projectRequest({
      _action: 'list',
      limit,
      offset,
    })

    const items = r.data
      ? r.data.map(d => new ChatAgent({ ...d, pageLinesAgent: this }))
      : undefined

    return { items, indexMeta: r.indexMeta }
  }

  async bulkEdit(params: { _action: 'delete', selectedIds: string[] }) {
    await this.requests.ManageIndex.projectRequest(params)
  }

  createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      pageLinesData: this.pageLinesData,
      pageLinesAgent: this,
    }
    return {
      ManageAgent: new QueryManageAgent(deps),
      ManageIndex: new QueryManageAgentIndex(deps),
      ManageDataSource: new QueryManageDataSource(deps),
      PublicAgent: new QueryPublicAgent(deps),
      ManageMessage: new QueryManageMessage(deps),
    } as const
  }
}
