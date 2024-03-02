import type { ViteDevServer } from 'vite'
import type {
  FactorApp,
  FactorEnv,
  FactorPluginSettings,
} from '@factor/api'
import {
  FactorPlugin,
} from '@factor/api'
import { getServer } from './test/app'

type PageLinesEmbedSettings = {
  factorApp: FactorApp
  factorEnv: FactorEnv
  testSitePort?: number
  port?: number
} & FactorPluginSettings

export class PageLinesEmbed extends FactorPlugin<PageLinesEmbedSettings> {
  root = this.utils.safeDirname(import.meta.url)
  factorApp = this.settings.factorApp
  factorEnv = this.settings.factorEnv
  testSitePort = this.settings.testSitePort
  viteServer?: ViteDevServer

  constructor(settings: PageLinesEmbedSettings) {
    super('PageLinesEmbed', settings)
    this.factorEnv?.addUiPaths([`${this.root}/*.vue`, `${this.root}/*.ts`])
  }

  async testSite(action: 'start' | 'stop') {
    if (!this.testSitePort)
      return

    if (action === 'start') {
      this.viteServer = await getServer({
        port: this.testSitePort,
        factorEnv: this.factorEnv,
      })

      await this.viteServer.listen()

      this.log.info(`embed test site @ ${this.testSitePort}`)
    }

    if (action === 'stop' && this.viteServer)
      await this.viteServer.close()
  }
}
