import type { FictionCache, FictionDb, FictionPluginSettings, FictionServer, FictionUser, vue } from '@fiction/core'
import { FictionPlugin, safeDirname } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { QueryGetClientSessions, QueryGetDimensionList, QueryGetTotalSessions, QueryMetricAnalytics, QueryMetricTrack } from './endpoints'
import { FictionBeacon } from './plugin-beacon'
import { FictionClickHouse } from './plugin-clickhouse'

vars.register(() => [new EnvVar({ name: 'CLICKHOUSE_URL' })])

export type FictionAnalyticsSettings = {
  // required modules
  fictionServer: FictionServer
  fictionDb: FictionDb
  fictionUser?: FictionUser
  fictionCache?: FictionCache
  // plugin specific
  isLive?: vue.Ref<boolean>
  clickhouseUrl: string
  beaconPort: number
  beaconUrlLive?: string
  sessionExpireAfterMs?: number
  checkExpiredIntervalMs?: number
  bufferIntervalMs?: number
} & FictionPluginSettings

interface MetricTypes {
  content_words_post: { count: number }
  content_words_site: { count: number }
  content_posts_total: { count: number }
  audience_subscribers_total: { count: number }
  audience_followers_x: { count: number }
  audience_followers_linkedin: { count: number }
  audience_followers_youtube: { count: number }
  audience_followers_instagram: { count: number }
}
export class FictionAnalytics extends FictionPlugin<FictionAnalyticsSettings> {
  fictionClickhouse = new FictionClickHouse({ fictionAnalytics: this, ...this.settings })
  fictionBeacon = new FictionBeacon({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings })
  queries = {
    MetricTrack: new QueryMetricTrack({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings }),
    MetricAnalytics: new QueryMetricAnalytics({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings }),
    GetDimensionList: new QueryGetDimensionList({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings }),
    GetClientSessions: new QueryGetClientSessions({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings }),
    GetTotalSessions: new QueryGetTotalSessions({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings }),
  }

  requests = this.createRequests({
    queries: this.queries,
    fictionServer: this.settings.fictionServer,
    fictionUser: this.settings.fictionUser,
    basePath: '/analytics',
  })

  constructor(settings: FictionAnalyticsSettings) {
    super('FictionAnalytics', { root: safeDirname(import.meta.url), ...settings })

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

  async serverTrackMetric(args: {
    orgId: string
    metric: keyof MetricTypes
    count: number
    handling: 'increment' | 'snapshot'
  }) {
    return await this.queries.MetricTrack.serve(args, { caller: 'trackMetric', server: true })
  }
}
