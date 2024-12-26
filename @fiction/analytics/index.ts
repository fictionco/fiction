import type { FictionCache, FictionDb, FictionPluginSettings, FictionServer, FictionUser, vue } from '@fiction/core'
import type { EventParams } from './tables'
import { FictionPlugin, safeDirname } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { QueryEventTrack, QueryGetClientSessions, QueryGetDimensionList, QueryGetTotalSessions, QueryMetricAnalytics } from './endpoints'
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

interface EventTypes {
  content_total_words_post: { value: number }
  content_total_words_site: { value: number }
  content_total_posts: { value: number }
  audience_total_subscribers: { value: number }
  audience_total_followers_x: { value: number }
  audience_total_followers_linkedin: { value: number }
  audience_total_followers_youtube: { value: number }
  audience_total_followers_instagram: { value: number }
  audience_unsubscribe: { email: string }
  audience_subscribe: { email: string }
  email_cleaned: { email: string }
  email_sent: { value: number, campaignId: string }
  email_open: { email: string, campaignId: string }
  email_click: { email: string, campaignId: string }
  email_bounce: { email: string, campaignId: string }
  email_spam: { email: string, campaignId: string }
  form_submit: { formId: string }
}

export class FictionAnalytics extends FictionPlugin<FictionAnalyticsSettings> {
  fictionClickhouse = new FictionClickHouse({ fictionAnalytics: this, ...this.settings })
  fictionBeacon = new FictionBeacon({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings })
  queries = {
    EventTrack: new QueryEventTrack({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings }),
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

  async init() {
    return Promise.all([
      this.fictionClickhouse?.init(),
    ])
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

  async track<T extends keyof EventTypes>(args: {
    orgId: string
    event: T
  } & EventTypes[T]) {
    return await this.queries.EventTrack.serve({
      ...args,
      event: args.event as string,
    }, { caller: 'trackMetric', server: true })
  }
}
