import { mapTypeHelper } from './helpers'
import * as dimension from './dimension/map'
import * as heatmap from './heatmap/map'
import * as chart from './chart/map'
import * as aggregation from './aggregation/map'
import * as conversion from './conversion/map'
import * as technical from './technical/map'
import * as replay from './replay/map'
import * as location from './location/map'
import * as security from './security/map'

export type WidgetDataMap = typeof widgetDataMap
export const widgetDataMap = mapTypeHelper({
  ...dimension.map,
  ...heatmap.map,
  ...chart.map,
  ...aggregation.map,
  ...conversion.map,
  ...technical.map,
  ...replay.map,
  ...location.map,
  ...security.map,

  activeUsers: {
    title: 'Active Users',
    description: 'This is the realtime data of users active on your site',
    groupBy: 'minute',
    table: 'event',
    queryFormat: 'activeUsers',
    ui: 'ActiveUsers',
    rowSpan: 1,
    colSpan: 3,
    realtime: true,
    custom: true,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>`,
  },
  activeConversions: {
    title: 'Active Conversions',
    description: 'Realtime conversions happening on your site',
    groupBy: 'minute',
    table: 'event',
    queryFormat: 'activeUsers',
    ui: 'ActiveConversions',
    rowSpan: 1,
    colSpan: 3,
    realtime: true,
    custom: true,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>`,
  },
})
