import type { FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { EnvVar, FictionPlugin, safeDirname, vars } from '@fiction/core'
import { QueryUnsplash } from './endpoint'

vars.register(() => [
  new EnvVar({ name: 'UNSPLASH_ACCESS_KEY', isOptional: true }),
])

type FictionUnsplashSettings = {
  fictionUser?: FictionUser
  fictionServer: FictionServer
  unsplashAccessKey?: string
} & FictionPluginSettings

export class FictionUnsplash extends FictionPlugin<FictionUnsplashSettings> {
  unsplashAccessKey = this.settings.unsplashAccessKey
  queries = {
    Unsplash: new QueryUnsplash({ fictionUnsplash: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/unsplash',
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
  })

  constructor(settings: FictionUnsplashSettings) {
    super('FictionUnsplash', { ...settings, root: safeDirname(import.meta.url) })
  }
}
