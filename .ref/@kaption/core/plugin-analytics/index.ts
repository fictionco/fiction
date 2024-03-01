import type { KaptionPluginSettings } from '../utils'
import { KaptionPlugin } from '../utils'
import { KaptionDbCol } from '../utils/db'
import { widgets } from './widgets'
import { getDashboards } from './dashboards'
import { getRoutes } from './routes'
import { analyticsProjectColumns } from './tables'

type KaptionAnalyticsSettings = {} & KaptionPluginSettings
export class KaptionAnalytics extends KaptionPlugin<KaptionAnalyticsSettings> {
  factorAdmin = this.settings.factorAdmin
  kaptionDashboard = this.settings.kaptionDashboard
  factorRouter = this.settings.factorRouter
  factorApp = this.settings.factorApp
  root = this.utils.safeDirname(import.meta.url)
  constructor(settings: KaptionAnalyticsSettings) {
    super('analytics', settings)

    this.factorApp?.addUiPaths([`${this.root}/**/*.vue`])
    this.factorRouter?.update(getRoutes())
    this.kaptionDashboard?.addDashboards(getDashboards())

    this.kaptionDashboard?.addWidgets(widgets(this.settings))

    // add analytics columns to kaption project table.
    this.factorDb.addColumns('kaption_project', analyticsProjectColumns)

    this.factorDb.addColumns('kaption_usage', [
      new KaptionDbCol({
        key: 'total',
        create: ({ schema, column }) => schema.integer(column.pgKey),
        default: () => 0,
      }),
      new KaptionDbCol({
        key: 'session',
        create: ({ schema, column }) => schema.integer(column.pgKey),
        default: () => 0,
      }),
    ])

    this.factorAdmin?.hooks.push({
      hook: 'menus',
      callback: (menus) => {
        menus.primary.push('analyticsIndex')
        return menus
      },
    })
  }
}
