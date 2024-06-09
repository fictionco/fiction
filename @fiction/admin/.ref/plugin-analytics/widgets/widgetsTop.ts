import { Widget } from '@factor/api/plugin-dashboards'
import type { KaptionPluginSettings } from '../../utils'
import { QueryWidgetAggregation } from './queryAggregate'

const el = () => import('./WidgetList.vue')

export function widgets(service: KaptionPluginSettings) {
  return [
    new Widget({
      widgetKey: 'topBrowsers',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'browser',
      }),
      title: 'Top Browsers',
      description: 'Aggregation of top browsers',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'enriched',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topCountries',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'countryCode',
      }),
      title: 'Top Countries',
      description: 'Aggregation of top countries',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'country',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topReferrers',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'referrer',
        selectors: ['referrer as url'],
      }),
      title: 'Top Referrers',
      description: 'Aggregation of top traffic referrers',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'enriched',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topSources',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'referralSource',
        selectors: ['topK(1)(referrer) as url'],
      }),
      title: 'Top Sources',
      description: 'Aggregation of top traffic sources (utm_source)',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'standard',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topMediums',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'referralMedium',
        selectors: ['topK(1)(referrer) as url'],
      }),
      title: 'Top Referral Mediums',
      description: 'Aggregation of top traffic mediums (utm_medium)',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'standard',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topCampaigns',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'referralCampaign',
        selectors: ['topK(1)(referrer) as url'],
      }),
      title: 'Top Referral Campaigns',
      description: 'Aggregation of top traffic campaigns (utm_campaign)',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'standard',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topPages',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'pathname',
        where: { event: 'view' },
        countOn: 'count(*)',
        selectors: ['topK(1)(referrer) as url'],
      }),
      title: 'Top Pages',
      description: 'Aggregation of top pages by total page views',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'standard',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topOperatingSystems',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'os',
      }),
      title: 'Top Operating Systems',
      description: 'Aggregation of top operating systems',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'enriched',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topDevices',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'deviceType',
      }),
      title: 'Device Breakdown',
      description: 'Aggregation by device type',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'enriched',
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'topEvent',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'event',
        countOn: 'count(*)',
      }),
      title: 'Top Events',
      description: 'Aggregation of events by count',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'standard',
      },
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'topEventCategory',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'category',
        countOn: 'count(*)',
      }),
      title: 'Top Event Categories',
      description: 'Aggregation of events by event category',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'standard',
      },
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'topEventAction',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'action',
        countOn: 'count(*)',
      }),
      title: 'Top Event Actions',
      description: 'Aggregation of events by event action',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'standard',
      },
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'topEventLabel',
      queryHandler: new QueryWidgetAggregation({
        service,
        groupBy: 'label',
        countOn: 'count(*)',
      }),
      title: 'Top Event Labels',
      description: 'Aggregation of events by event label',
      layoutHandling: 'list',
      el,
      ui: {
        aggregationFormat: 'standard',
      },
      category: ['events'],
    }),
  ]
}
