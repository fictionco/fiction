import type { FictionCache, FictionDb, FictionPluginSettings, FictionServer, FictionUser, vue } from '@fiction/core'
import type { EventParams } from './tables'
import { FictionPlugin, safeDirname } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'
import { QueryCompiledMetrics } from './endpointMetrics'
import { QueryGetClientSessions, QueryGetDimensionList, QueryGetTotalSessions, QueryMetricAnalytics } from './endpoints'
import { QueryEventTrack } from './endpointTrack'
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

export interface TrackEventTypes {
  contentTotalWordsPosts: { value: number } & Partial<EventParams>
  contentTotalWordsSites: { value: number } & Partial<EventParams>
  contentTotalPosts: { value: number } & Partial<EventParams>
  subscriptionTotalActive: { value: number } & Partial<EventParams>
  subscriptionTotalUnsubscribed: { value: number } & Partial<EventParams>
  subscriptionTotalCleaned: { value: number } & Partial<EventParams>
  subscriptionUnsubscribed: { email: string } & Partial<EventParams>
  subscriptionActive: { email: string } & Partial<EventParams>
  subscriptionCleaned: { email: string } & Partial<EventParams>
  subscriptionPending: { email: string } & Partial<EventParams>
  emailDelivered: { value: number, campaignId: string } & Partial<EventParams>
  emailOpened: { email: string, campaignId: string } & Partial<EventParams>
  emailClicked: { email: string, campaignId: string, url: string } & Partial<EventParams>
  emailBounced: { email: string, campaignId: string } & Partial<EventParams>
  emailFailed: { email: string, campaignId: string } & Partial<EventParams>
  emailComplained: { email: string, campaignId: string } & Partial<EventParams>
  formSubmit: { formId: string } & Partial<EventParams>
}

export class FictionAnalytics extends FictionPlugin<FictionAnalyticsSettings> {
  fictionClickhouse = new FictionClickHouse({ fictionAnalytics: this, ...this.settings })
  fictionBeacon = new FictionBeacon({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings })
  queries = {
    CompiledMetrics: new QueryCompiledMetrics({ fictionAnalytics: this, fictionClickHouse: this.fictionClickhouse, ...this.settings }),
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

  async track<T extends keyof TrackEventTypes>(args: {
    orgId: string
    event: T
  } & TrackEventTypes[T]) {
    return await this.queries.EventTrack.serve({
      ...args,
      event: args.event as string,
    }, { caller: 'trackMetric', server: true })
  }
}
