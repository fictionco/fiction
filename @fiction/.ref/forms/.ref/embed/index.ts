import type { ViteDevServer } from 'vite'
import type { FictionPluginSettings } from '@fiction/core'
import { FictionPlugin } from '@fiction/core'
import { getServer } from './test/app'

type FictionEmbedSettings = {
  testSitePort: number
} & FictionPluginSettings

export class FictionEmbed extends FictionPlugin<FictionEmbedSettings> {
  testSitePort = this.settings.testSitePort
  viteServer?: ViteDevServer
  constructor(settings: FictionEmbedSettings) {
    super('FictionEmbed', settings)
  }

  async testSite(action: 'start' | 'stop') {
    if (action === 'start') {
      this.viteServer = await getServer({
        port: this.testSitePort,
        factorEnv: this.settings.fictionEnv,
      })

      await this.viteServer.listen()

      this.log.info(`embed test site @ ${this.testSitePort}`)
    }

    if (action === 'stop' && this.viteServer)
      await this.viteServer.close()
  }
}
