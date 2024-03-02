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
  EnvVar,
  FactorPlugin,
  vars,
} from '@factor/api'
import { QueryManageVectors, QueryVectorSearch } from './endpoint'

vars.register(() => [
  new EnvVar({
    name: 'PINECONE_API_KEY',
  }),
  new EnvVar({
    name: 'PINECONE_ENVIRONMENT',
  }),
  new EnvVar({ name: 'PINECONE_INDEX' }),
  new EnvVar({ name: 'OPENAI_API_KEY' }),
])

export interface PushNotification {
  title: string
  body: string
  icon?: string
  url?: string
}

export type PageLinesDataSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser?: FactorUser
  factorApp: FactorApp
  factorRouter: FactorRouter
  openAIApiKey?: string
  pineconeApiKey?: string
  pineconeEnvironment?: string
  pineconeIndex?: string
} & FactorPluginSettings

export class PageLinesData extends FactorPlugin<PageLinesDataSettings> {
  factorEnv = this.settings.factorEnv
  factorApp = this.settings.factorApp
  factorRouter = this.settings.factorRouter
  factorDb = this.settings.factorDb
  factorUser = this.settings.factorUser
  factorServer = this.settings.factorServer
  openAIApiKey = this.settings.openAIApiKey || ''
  pineconeApiKey = this.settings.pineconeApiKey || ''
  pineconeEnvironment = this.settings.pineconeEnvironment || ''
  pineconeIndex = this.settings.pineconeIndex || ''
  loading = this.utils.vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  isLive = this.factorEnv.isProd
  queries = this.createQueries()
  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  constructor(settings: PageLinesDataSettings) {
    super('PageLinesData', settings)

    if (
      !this.factorEnv.isApp.value
      && (!this.openAIApiKey
      || !this.pineconeApiKey
      || !this.pineconeEnvironment
      || !this.pineconeIndex)
    )
      this.log.error('Missing Pinecone or OpenAI API keys')
  }

  protected createQueries() {
    const deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      pageLinesData: this,
    }
    return {
      ManageVectors: new QueryManageVectors(deps),
      VectorSearch: new QueryVectorSearch(deps),
    } as const
  }
}
