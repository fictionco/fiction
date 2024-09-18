import type { FictionDb, FictionMedia, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { EnvVar, FictionPlugin, safeDirname, vars, vue } from '@fiction/core'
import { AiCompletion, AiImage, QueryManageVectors } from './endpoint'

vars.register(() => [
  new EnvVar({ name: 'PINECONE_API_KEY' }),
  new EnvVar({ name: 'PINECONE_ENVIRONMENT' }),
  new EnvVar({ name: 'PINECONE_INDEX' }),
  new EnvVar({ name: 'OPENAI_API_KEY' }),
  new EnvVar({ name: 'ANTHROPIC_API_KEY' }),
])

export interface PushNotification {
  title: string
  body: string
  icon?: string
  url?: string
}

export type FictionAiSettings = {
  fictionServer: FictionServer
  fictionDb: FictionDb
  fictionUser?: FictionUser
  fictionMedia?: FictionMedia
  openaiApiKey?: string
  anthropicApiKey?: string
  pineconeApiKey?: string
  pineconeEnvironment?: string
  pineconeIndex?: string
} & FictionPluginSettings

export class FictionAi extends FictionPlugin<FictionAiSettings> {
  loading = vue.ref(false)
  root = safeDirname(import.meta.url)
  queries = {
    ManageVectors: new QueryManageVectors({ ...this.settings, fictionAi: this }),
    AiCompletion: new AiCompletion({ ...this.settings, fictionAi: this }),
    AiImage: new AiImage({ ...this.settings, fictionAi: this }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: FictionAiSettings) {
    super('FictionAi', { root: safeDirname(import.meta.url), ...settings })

    if (this.fictionEnv?.isServer.value) {
      this.fictionEnv.serverOnlyImports['@pinecone-database/pinecone'] = { Pinecone: '() => {}' }

      const { openaiApiKey, pineconeApiKey, pineconeEnvironment, pineconeIndex } = this.settings
      if (
        !this.settings.fictionEnv.isApp.value
        && (!openaiApiKey || !pineconeApiKey || !pineconeEnvironment || !pineconeIndex)
      ) {
        this.log.warn('Missing Pinecone or OpenAI API keys', { data: { openaiApiKey, pineconeApiKey, pineconeEnvironment, pineconeIndex } })
      }
    }
  }
}
