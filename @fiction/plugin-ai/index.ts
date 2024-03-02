// @unocss-include

import type { FactorDb, FactorMedia, FactorPluginSettings, FactorServer, FactorUser } from '@fiction/core'
import { EnvVar, FactorPlugin, safeDirname, vars } from '@fiction/core'
import { AiCompletion, AiImage, QueryManageVectors } from './endpoint'

vars.register(() => [
  new EnvVar({ name: 'PINECONE_API_KEY' }),
  new EnvVar({ name: 'PINECONE_ENVIRONMENT' }),
  new EnvVar({ name: 'PINECONE_INDEX' }),
  new EnvVar({ name: 'OPENAI_API_KEY' }),
])

export interface PushNotification {
  title: string
  body: string
  icon?: string
  url?: string
}

export type FactorAiSettings = {
  factorServer: FactorServer
  factorDb: FactorDb
  factorUser?: FactorUser
  factorMedia?: FactorMedia
  openaiApiKey?: string
  pineconeApiKey?: string
  pineconeEnvironment?: string
  pineconeIndex?: string
} & FactorPluginSettings

export class FactorAi extends FactorPlugin<FactorAiSettings> {
  loading = this.utils.vue.ref(false)
  root = this.utils.safeDirname(import.meta.url)
  queries = {
    ManageVectors: new QueryManageVectors({ ...this.settings, factorAi: this }),
    AiCompletion: new AiCompletion({ ...this.settings, factorAi: this }),
    AiImage: new AiImage({ ...this.settings, factorAi: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    factorServer: this.settings.factorServer,
    factorUser: this.settings.factorUser,
  })

  constructor(settings: FactorAiSettings) {
    super('FactorAi', { root: safeDirname(import.meta.url), ...settings })

    if (this.factorEnv?.isServer.value) {
      this.factorEnv.serverOnlyImports['@pinecone-database/pinecone'] = { Pinecone: '() => {}' }

      const { openaiApiKey, pineconeApiKey, pineconeEnvironment, pineconeIndex } = this.settings
      if (
        !this.settings.factorEnv.isApp.value
        && (!openaiApiKey || !pineconeApiKey || !pineconeEnvironment || !pineconeIndex)
      )
        this.log.warn('Missing Pinecone or OpenAI API keys', { data: { openaiApiKey, pineconeApiKey, pineconeEnvironment, pineconeIndex } })
    }
  }
}
