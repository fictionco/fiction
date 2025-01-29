import type { FictionAnalytics } from '@fiction/analytics'
import type { EndpointResponse, FictionDb, FictionEmail, FictionEnv, FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import type { TableMetricConfig } from './schema'
import { FictionPlugin } from '@fiction/core'
import { t, tables } from './schema'

type FictionMetricsSettings = {
  fictionDb: FictionDb
  fictionServer: FictionServer
  fictionEmail: FictionEmail
  fictionEnv: FictionEnv
  fictionUser: FictionUser
  fictionAnalytics: FictionAnalytics
} & FictionPluginSettings

type MetricCollector = {
  getMetric: (args: { orgId: string }) => Promise<EndpointResponse<{ count: number }>>
  interval: 'hourly' | 'daily'
  handling: 'snapshot' | 'increment'
  metricType: string
}

export class FictionMetrics extends FictionPlugin<FictionMetricsSettings> {
  metricCollectors: MetricCollector[] = []

  constructor(settings: FictionMetricsSettings) {
    super('FictionMetrics', settings)

    this.settings.fictionDb?.addTables(tables)
  }

  addMetricCollector(collector: MetricCollector) {
    this.metricCollectors.push(collector)
  }

  async trackMetric(args: TableMetricConfig) {
    const { orgId, metric, count } = args
    const timestamp = Date.now()
    const metricRow = { orgId, metric, count, timestamp, handling: 'increment' }
    const db = this.settings.fictionDb.client()

    await db(t.metrics).into(t.metrics).insert(metricRow)

    const fictionClickHouse = this.settings.fictionAnalytics.fictionClickhouse

    if (fictionClickHouse) {
      await fictionClickHouse.saveData({ table: 'metrics', rows: [metricRow] })
    }
  }
}
