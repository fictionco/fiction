import type { FactorPluginSettings, FactorServer, FactorUser } from '@factor/api'
import { EnvVar, FactorPlugin, safeDirname, vars } from '@factor/api'
import { QueryUnsplash } from './endpoint'

vars.register(() => [
  new EnvVar({ name: 'UNSPLASH_ACCESS_KEY', isOptional: true }),
])

type FactorUnsplashSettings = {
  factorUser?: FactorUser
  factorServer: FactorServer
  unsplashAccessKey?: string
} & FactorPluginSettings

export class FactorUnsplash extends FactorPlugin<FactorUnsplashSettings> {
  unsplashAccessKey = this.settings.unsplashAccessKey
  queries = {
    Unsplash: new QueryUnsplash({ factorUnsplash: this, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    basePath: '/unsplash',
    factorServer: this.settings.factorServer,
    factorUser: this.settings.factorUser,
  })

  constructor(settings: FactorUnsplashSettings) {
    super('FactorUnsplash', { ...settings, root: safeDirname(import.meta.url) })
  }
}
