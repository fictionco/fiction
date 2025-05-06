import type { FictionApp, FictionEnv, FictionPluginSettings } from '@fiction/core'
import type { ViteDevServer } from 'vite'
import { FictionPlugin, safeDirname } from '@fiction/core'
import { getServer } from './test/app'

type FictionEmbedSettings = {
  fictionApp: FictionApp
  fictionEnv: FictionEnv
  testSitePort?: number
  port?: number
} & FictionPluginSettings

export class FictionEmbed extends FictionPlugin<FictionEmbedSettings> {
  root = safeDirname(import.meta.url)
  viteServer?: ViteDevServer

  constructor(settings: FictionEmbedSettings) {
    super('FictionEmbed', { root: safeDirname(import.meta.url), ...settings })
  }

  async testSite(action: 'start' | 'stop') {
    const testSitePort = this.settings.testSitePort
    if (!testSitePort)
      return

    if (action === 'start') {
      this.viteServer = await getServer({
        port: testSitePort,
        fictionEnv: this.fictionEnv,
      })

      await this.viteServer.listen()

      this.log.info(`embed test site @ ${testSitePort}`)
    }

    if (action === 'stop' && this.viteServer)
      await this.viteServer.close()
  }
}
