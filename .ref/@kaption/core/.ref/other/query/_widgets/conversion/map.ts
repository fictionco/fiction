import { mapTypeHelper } from '../helpers'

const icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
</svg>`

export const map = mapTypeHelper({
  totalMicroConversions: {
    title: 'Total Micro Conversions',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(hasMicroConversion) as totalMicroConversions'],
    queryFormat: 'chart',
    icon,
    custom: true,
  },
  microConversionRate: {
    title: 'Micro Conversion Rate',
    table: 'eventSession',
    groupBy: 'interval',
    requires: ['uniqueVisitors', 'totalMicroConversions'],
    selector: [
      'round(divide(totalMicroConversions, uniqueVisitors) * 100, 2) as microConversionRate',
    ],
    queryFormat: 'chart',
    valueFormat: 'percent',
    icon,
    custom: true,
  },
  totalMacroConversions: {
    title: 'Total Macro Conversions',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(hasMacroConversion) as totalMacroConversions'],
    queryFormat: 'chart',
  },
  macroConversionRate: {
    title: 'Macro Conversion Rate',
    table: 'eventSession',
    groupBy: 'interval',
    requires: ['uniqueVisitors', 'totalMacroConversions'],
    selector: [
      'round(divide(totalMacroConversions, uniqueVisitors) * 100, 2) as macroConversionRate',
    ],
    queryFormat: 'chart',
    valueFormat: 'percent',
    icon,
    custom: true,
  },
  topMicroConversions: {
    title: 'Top Micro Conversions',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'eventName',
    where: { eventType: 'micro' },
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon,
    custom: true,
  },
  topMacroConversions: {
    title: 'Top Macro Conversions',
    aggregationFormat: 'standard',
    table: 'event',
    groupBy: 'eventName',
    where: { eventType: 'macro' },
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon,
    custom: true,
  },
  topMacroReferrers: {
    title: 'Top Converting Referrers',
    aggregationFormat: 'standard',
    table: 'eventSession',
    groupBy: 'session_referrer',
    where: { hasMacroConversion: '1' },
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon,
    custom: true,
    pro: true,
  },
  topMacroCampaigns: {
    title: 'Top Converting Campaigns',
    aggregationFormat: 'standard',
    table: 'eventSession',
    groupBy: 'session_referralCampaign',
    where: { hasMacroConversion: '1' },
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    icon,
    custom: true,
    pro: true,
  },
})