import type { FictionPluginSettings, FictionServer, FictionUser } from '@fiction/core'
import { FictionPlugin } from '@fiction/core'
import { EnvVar, vars } from '@fiction/core/plugin-env'

vars.register(() => [new EnvVar({ name: 'CLICKHOUSE_URL' })])

type FictionAnalyticsSettings = {
  clickhouseUrl?: string
  fictionServer: FictionServer
  fictionUser?: FictionUser
} & FictionPluginSettings

export class FictionAnalytics extends FictionPlugin<FictionAnalyticsSettings> {
  constructor(settings: FictionAnalyticsSettings) {
    super('FictionAnalytics', settings)
  }
}
