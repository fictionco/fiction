import type { FictionCache, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin, safeDirname } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { FictionClickHouse } from './plugin-clickhouse'
import { FictionBeacon } from './plugin-beacon'

vars.register(() => [new EnvVar({ name: 'CLICKHOUSE_URL' })])

type FictionAnalyticsSettings = {
  clickhouseUrl?: string
  fictionServer: FictionServer
  fictionUser?: FictionUser
  fictionCache: FictionCache
  beaconPort: number
} & FictionPluginSettings

export class FictionAnalytics extends FictionPlugin<FictionAnalyticsSettings> {
  fictionClickhouse?: FictionClickHouse
  fictionBeacon?: FictionBeacon
  constructor(settings: FictionAnalyticsSettings) {
    super('FictionAnalytics', { root: safeDirname(import.meta.url), ...settings })

    this.fictionClickhouse = new FictionClickHouse({ fictionAnalytics: this, ...this.settings })
    this.fictionBeacon = new FictionBeacon({
      fictionAnalytics: this,
      fictionClickHouse: this.fictionClickhouse,
      ...this.settings,
    })
  }

  async close() {
    await this.fictionClickhouse?.close()
    await this.fictionBeacon?.close()
  }
}
