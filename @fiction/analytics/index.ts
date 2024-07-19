import type { FictionCache, FictionPluginSettings, FictionServer, FictionUser, vue } from '@fiction/core'
import { FictionPlugin, getAnonymousId, safeDirname } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { FictionClickHouse } from './plugin-clickhouse'
import { FictionBeacon } from './plugin-beacon'
import { initializeClient } from './tag/entry.js'

vars.register(() => [new EnvVar({ name: 'CLICKHOUSE_URL' })])

export type FictionAnalyticsSettings = {
  isLive?: vue.Ref<boolean>
  clickhouseUrl: string
  fictionServer: FictionServer
  fictionUser?: FictionUser
  fictionCache: FictionCache
  beaconPort: number
  beaconUrlLive?: string
  sessionExpireAfterMs?: number
  checkExpiredIntervalMs?: number
  bufferIntervalMs?: number
} & FictionPluginSettings

export class FictionAnalytics extends FictionPlugin<FictionAnalyticsSettings> {
  fictionClickhouse?: FictionClickHouse
  fictionBeacon?: FictionBeacon
  constructor(settings: FictionAnalyticsSettings) {
    super('FictionAnalytics', { root: safeDirname(import.meta.url), ...settings })

    this.fictionClickhouse = new FictionClickHouse({ fictionAnalytics: this, ...this.settings })
    this.fictionBeacon = new FictionBeacon({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings })

    this.fictionEnv.events.on('shutdown', async () => this.close())
  }

  async close() {
    await this.fictionClickhouse?.close()
    await this.fictionBeacon?.close()
  }

  async serverInit() {
    await this.fictionClickhouse?.init()
  }

  async runBeacon() {
    await this.fictionBeacon?.init()
  }

  async trackWebsiteEvents(args: { siteId: string, orgId: string }) {
    const beaconUrl = this.fictionBeacon?.beaconUrl.value

    if (!beaconUrl)
      throw new Error('Beacon URL not found')

    const { anonymousId } = getAnonymousId()

    initializeClient({ ...args, beaconUrl, anonymousId })
  }
}
