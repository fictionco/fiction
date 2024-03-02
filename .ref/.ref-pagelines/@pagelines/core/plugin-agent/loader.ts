import type {
  EndpointResponse,
  FactorApp,
  FactorDb,
  FactorMedia,
  FactorPluginSettings,
  FactorRouter,
  FactorServer,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import type { FactorCache } from '@factor/api/plugin-cache'
import type { PageLinesData } from '../plugin-data'
import { QueryPublicAgent } from './endpoint'
import { ChatAgent } from './obj'
import type { PageLinesAgent } from '.'

type AgentLoaderSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorApp: FactorApp
  factorMedia: FactorMedia
  factorRouter: FactorRouter
  factorCache: FactorCache
  pageLinesData: PageLinesData
  pageLinesAgent: PageLinesAgent
} & FactorPluginSettings

export class PageLinesAgentLoader extends FactorPlugin<AgentLoaderSettings> {
  root = this.utils.safeDirname(import.meta.url)
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorServer = this.settings.factorServer
  factorMedia = this.settings.factorMedia
  factorDb = this.settings.factorDb
  factorCache = this.settings.factorCache
  pageLinesData = this.settings.pageLinesData
  pageLinesAgent = this.settings.pageLinesAgent
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
  })

  agentState = this.utils.vue.shallowRef<
    EndpointResponse<ChatAgent | undefined>
  >({
    status: 'loading',
    data: undefined,
  },
  )

  activeForm = this.utils.vue.computed<ChatAgent | undefined>({
    get: () => {
      return this.agentState?.value.data
    },
    set: (v) => {
      if (v) {
        this.agentState.value = {
          ...this.agentState.value,
          data: { ...this.agentState.value.data, ...v },
        } as EndpointResponse<ChatAgent | undefined>
      }
    },
  })

  constructor(settings: AgentLoaderSettings) {
    super('AgentLoader', settings)

    this.factorEnv?.addUiPaths([`${this.root}/**/*.vue`, `${this.root}/*.ts`])

    this.init().catch(console.error)
  }

  setup() {}

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorCache: this.factorCache,
      pageLinesData: this.pageLinesData,
      pageLinesAgent: this.pageLinesAgent,
    }
    return {
      PublicAgent: new QueryPublicAgent(deps),
    } as const
  }

  async loadAgent(args: { agentId: string }) {
    const { agentId } = args
    const requestPromise = this.requests.PublicAgent.request({
      _action: 'retrieve',
      agentId,
    })

    this.agentState.value = {
      status: 'loading',
      data: undefined,
      loading: requestPromise,
    }

    const r = await requestPromise

    const loadedForm = {
      ...r,
      data: r.data
        ? new ChatAgent({ pageLinesAgent: this.pageLinesAgent, ...r.data })
        : undefined,
    }

    this.agentState.value = loadedForm
  }

  async init() {
    if (!this.utils.hasWindow())
      return

    this.utils.vue.watch(
      () => this.factorRouter.current.value,
      async (route) => {
        if (!route)
          return

        const agentId = route.params.agentId as string | undefined
        if (agentId)
          await this.loadAgent({ agentId })
      },
      { immediate: true },
    )
  }
}
