import type {
  KaptionEndpointMap,
  KaptionPluginSettings,
} from '../utils'
import {
  KaptionEndpoint,
  KaptionPlugin,
} from '../utils'
import type { KaptionProxyServer } from '../plugin-proxy/proxyServer'
import { getRoutes } from './routes'
import { getDashboards } from './dashboards'
import { getWidgets } from './widgets'

type KaptionHeatmapsSettings = {
  kaptionProxyServer: KaptionProxyServer
} & KaptionPluginSettings

export class KaptionHeatmaps extends KaptionPlugin<KaptionHeatmapsSettings> {
  queries = this.createQueries()
  requests = this.createRequests<KaptionEndpointMap<typeof this.queries>>({
    queries: this.queries,
    endpointHandler: (opts) => {
      return new KaptionEndpoint({ ...opts, factorAdmin: this.factorAdmin })
    },
    factorServer: this.factorServer,
    factorUser: this.factorUser,
  })

  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: KaptionHeatmapsSettings) {
    super('heatmaps', settings)

    this.factorApp?.addUiPaths([`${this.root}/**/*.vue`])
    this.factorRouter?.update(getRoutes())

    this.kaptionDashboard?.addDashboards(getDashboards())

    this.kaptionDashboard?.addWidgets(getWidgets(this.settings))

    // this.kaptionDashboard?.addToDashboard({
    //   layout: [{ widgetKey: "heatmapsOverview" }],
    //   dashboardId: "home",
    // })
  }

  setup() {}

  protected createQueries() {
    const _deps = {
      factorDb: this.factorDb,
      factorUser: this.factorUser,
      kaptionCache: this.kaptionCache,
    }
    return {} as const
  }
}
