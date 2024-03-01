import type { ViteDevServer } from 'vite'
import type { KaptionPluginSettings } from '../utils'
import { KaptionPlugin } from '../utils'
import { getServer } from './test/app'

type KaptionEmbedSettings = {
  testSitePort: number
} & KaptionPluginSettings

export class KaptionEmbed extends KaptionPlugin<KaptionEmbedSettings> {
  root = this.utils.safeDirname(import.meta.url)
  testSitePort = this.settings.testSitePort
  viteServer?: ViteDevServer
  constructor(settings: KaptionEmbedSettings) {
    super('KaptionEmbed', settings)
    this.factorApp?.addUiPaths([`${this.root}/*.vue`, `${this.root}/*.ts`])
  }

  async testSite(action: 'start' | 'stop') {
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
