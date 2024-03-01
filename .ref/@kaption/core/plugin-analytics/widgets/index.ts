import type { KaptionPluginSettings } from '../../utils'
import { widgets as trafficWidgets } from './widgets'
import { widgets as realtimeWidgets } from './widgetsLive'
import { widgets as aggregationWidgets } from './widgetsTop'
import { widgets as reportWidgets } from './widgetsReports'

export function widgets(service: KaptionPluginSettings) {
  return [
    ...trafficWidgets(service),
    ...realtimeWidgets(service),
    ...aggregationWidgets(service),
    ...reportWidgets(service),
  ]
}
