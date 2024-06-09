// @unocss-include
import { Widget } from '@factor/api/plugin-dashboards'
import type { KaptionPluginSettings } from '../../utils'
import { QueryWidgetAggregation } from './queryAggregate'
import { QueryWidgetChart } from './queryDateChart'
import { QueryPageEvents } from './queryPage'

const el = () => import('./WidgetDateChart.vue')
const elList = () => import('./WidgetList.vue')

export function widgets(service: KaptionPluginSettings) {
  const QueryWidgetChartSession = new QueryWidgetChart({
    service,
    key: 'chartSession',
    table: 'eventSession',
  })
  const QueryWidgetChartEvents = new QueryWidgetChart({
    service,
    key: 'chartEvents',
    table: 'event',
  })
  return [
    new Widget({
      widgetKey: 'events',
      queryHandler: (w) => {
        return QueryWidgetChartEvents.selectorsAdd([
          `count(*) as ${w.widgetKey}`,
        ])
      },
      title: 'Total Events',
      description: 'Total amount of events tracked',
      el,
      layoutHandling: 'chart',
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'eventValue',
      queryHandler: (w) => {
        return QueryWidgetChartEvents.selectorsAdd([
          `sum(value) as ${w.widgetKey}`,
        ])
      },
      title: 'Event Value',
      description: 'Total value of events tracked',
      el,
      layoutHandling: 'chart',
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'topEventValue',
      queryHandler: (widget) => {
        return new QueryWidgetAggregation({
          service,
          widget,
          groupBy: 'event',
          countOn: 'sum(value)',
          q: (base) => {
            return base.where('value', '>', 0)
          },
        })
      },
      title: 'Top Event Value',
      description: 'Aggregation of events by value',
      el: elList,
      layoutHandling: 'list',
      category: ['events', 'conversion'],
    }),
    new Widget({
      widgetKey: 'topConversionEvents',
      queryHandler: (widget) => {
        return new QueryWidgetAggregation({
          service,
          widget,
          groupBy: 'event',
          countOn: 'count(*)',
          where: { conversion: 'conversion' },
        })
      },
      title: 'Top Conversion Events',
      description: 'Aggregation of events by total conversions',
      el: elList,
      layoutHandling: 'list',
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'topGoalEvents',
      queryHandler: (widget) => {
        return new QueryWidgetAggregation({
          service,
          widget,
          groupBy: 'event',
          countOn: 'count(*)',
          where: { conversion: 'goal' },
        })
      },
      title: 'Top Goal Events',
      el: elList,
      layoutHandling: 'list',
      category: ['conversion'],
    }),
    new Widget({
      widgetKey: 'topEvents',
      queryHandler: (widget) => {
        return new QueryWidgetAggregation({
          service,
          widget,
          groupBy: 'event',
          countOn: 'count(*)',
        })
      },
      title: 'Top Events',
      description: 'Aggregation of events by number tracked',
      el: elList,
      layoutHandling: 'list',
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'uniqueVisitors',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `uniq(session_anonymousId) as ${w.widgetKey}`,
        ])
      },
      title: 'Unique Visitors',
      description: 'Chart of unique visitors over time',
      el,
      layoutHandling: 'chart',
      ui: {
        icon: `i-carbon-data-view-alt`,
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'returningVisitors',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_isReturning) as ${w.widgetKey}`,
        ])
      },
      title: 'Returning Visitors',
      description:
        'Amount of users that have visited your site previously (without clearing browsing data)',
      el,
      layoutHandling: 'chart',
      ui: {
        icon: `i-carbon-data-view-alt`,
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'engageDuration',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(avg(session_engageDuration), 1) as ${w.widgetKey}`,
        ])
      },
      title: 'Average Time Engaged',
      description:
        'Average amount of time a visitor spent interactively engaging with your site',
      el,
      layoutHandling: 'chart',
      ui: {
        icon: `i-carbon-data-view-alt`,
        valueFormat: 'duration',
      },
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'sessionDuration',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          'round(avg(session_duration), 1) as sessionDuration',
        ])
      },
      title: 'Session Duration',
      description: 'The average time from beginning to end of a session',
      el,
      layoutHandling: 'chart',
      ui: {
        icon: `i-carbon-data-view-alt`,
        valueFormat: 'duration',
      },
      category: ['behavior'],
    }),

    new Widget({
      widgetKey: 'bounceRate',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(avg(session_isBounce) * 100, 1) as bounceRate`,
        ])
      },
      title: 'Average Bounce Rate',
      description: 'The percent of traffic leaving after one page view',
      el,
      layoutHandling: 'chart',
      ui: {
        icon: `i-carbon-data-view-alt`,
        valueFormat: 'percent',
        changeFormat: 'inverse',
      },
      category: ['behavior'],
    }),

    new Widget({
      widgetKey: 'uniqueSessions',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `count(*) as uniqueSessions`,
        ])
      },
      title: 'Total Sessions',
      description: 'Total number of distinct sessions',
      el,
      layoutHandling: 'chart',
      ui: {
        icon: `i-carbon-data-view-alt`,
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'totalViews',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_pageCount) as totalViews`,
        ])
      },
      title: 'Total Page Views',
      description: 'Total page views across all sessions',
      el,
      layoutHandling: 'chart',
      ui: {
        icon: `i-carbon-data-view-alt`,
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'averageViews',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(avg(session_pageCount), 1) as averageViews`,
        ])
      },
      title: 'Page Views / Session',
      description: 'Average number of page views per session',
      el,
      layoutHandling: 'chart',
      ui: {
        icon: `i-carbon-data-view-alt`,
      },
      category: ['traffic'],
    }),
    new Widget({
      widgetKey: 'totalEvents',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_eventCount) as totalEvents`,
        ])
      },
      title: 'Total Events',
      description: 'Total events across all sessions',
      el,
      layoutHandling: 'chart',
      ui: {},
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'averageEvents',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(avg(session_eventCount), 1) as averageEvents`,
        ])
      },
      title: 'Events / Session',
      description: 'Average events per session',
      el,
      layoutHandling: 'chart',
      ui: {},
      category: ['events'],
    }),
    new Widget({
      widgetKey: 'totalScrolls',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_scrollTotal) as totalScrolls`,
        ])
      },
      title: 'Total Scrolls',
      description: 'Total number of scrolls across all sessions',
      el,
      layoutHandling: 'chart',
      ui: {},
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'averageScrolls',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `avg(session_scrollTotal) as averageScrolls`,
        ])
      },
      title: 'Average Scrolls',
      description: 'Average number of scrolls per session',
      el,
      layoutHandling: 'chart',
      ui: {},
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'averageScrollDepth',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `avgIf(session_scrollDepth, isFinite(session_scrollDepth)) as averageScrollDepth`,
        ])
      },
      title: 'Average Scroll Depth',
      description: 'The average page scroll depth across sessions',
      el,
      layoutHandling: 'chart',
      ui: { valueFormat: 'percent' },
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'totalClicks',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_clickTotal) as totalClicks`,
        ])
      },
      title: 'Total Clicks',
      description: 'Total clicks across all sessions',
      el,
      layoutHandling: 'chart',
      ui: {},
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'averageClicks',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(avg(session_clickTotal), 1) as averageClicks`,
        ])
      },
      title: 'Clicks Per Session',
      description: 'Average clicks per session',
      el,
      layoutHandling: 'chart',
      ui: {},
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'totalTouches',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_touchTotal) as totalTouches`,
        ])
      },
      title: 'Total Touches',
      description: 'Total screen touches across all sessions',
      el,
      layoutHandling: 'chart',
      ui: {},
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'averageTouches',
      queryHandler: () => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(avg(session_touchTotal), 1) as averageTouches`,
        ])
      },
      title: 'Touches per Session',
      description: 'Average screen touches per session',
      el,
      layoutHandling: 'chart',
      ui: {},
      category: ['behavior'],
    }),
    new Widget({
      widgetKey: 'totalGoalConversions',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_hasGoalConversion) as ${w.widgetKey}`,
        ])
      },
      title: 'Total Goal Conversions',
      description: 'Total goal conversions across all sessions',
      el,
      layoutHandling: 'chart',
      category: ['conversion'],
    }),
    new Widget({
      widgetKey: 'goalConversionRate',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(divide(sum(session_hasGoalConversion), uniq(session_sessionId)) * 100, 2) as ${w.widgetKey}`,
        ])
      },
      title: 'Goal Conversion Rate',
      description: 'Percentage of sessions that had at least one conversion',
      el,
      layoutHandling: 'chart',
      ui: {
        valueFormat: 'percent',
      },
      category: ['conversion'],
    }),
    new Widget({
      widgetKey: 'totalConversions',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_hasConversion) as ${w.widgetKey}`,
        ])
      },
      title: 'Total Conversions',
      description: 'Total primary conversions across all sessions',
      el,
      layoutHandling: 'chart',
      category: ['conversion'],
    }),
    new Widget({
      widgetKey: 'conversionRate',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(divide(sum(session_hasConversion), uniq(session_sessionId)) * 100, 2) as ${w.widgetKey}`,
        ])
      },
      title: 'Conversion Rate',
      description:
        'Percentage of sessions that had at least one primary conversion',
      el,
      layoutHandling: 'chart',
      ui: {
        valueFormat: 'percent',
      },
      category: ['conversion'],
    }),
    new Widget({
      widgetKey: 'topGoalConversions',
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          groupBy: 'event',
          countOn: 'count(*)',
          where: { conversion: 'goal' },
        }),
      layoutHandling: 'list',
      title: 'Top Goal Conversions',
      description: 'Most common goal conversion events',
      el: elList,
      category: ['conversion'],
    }),
    new Widget({
      widgetKey: 'topConversions',
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          groupBy: 'event',
          countOn: 'count(*)',
          where: { conversion: 'conversion' },
        }),
      layoutHandling: 'list',
      title: 'Top Conversions',
      description: 'Most common conversion events',
      el: elList,
      category: ['conversion'],
    }),
    new Widget({
      widgetKey: 'topConvertingReferrers',
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          table: 'eventSession',
          groupBy: 'session_referrer',
          countOn: 'count(*)',
          where: { session_hasConversion: '1' },
        }),
      layoutHandling: 'list',
      title: 'Top Converting Referrers',
      description: 'Which referrers send most converting traffic',
      el: elList,
      category: ['conversion'],
    }),
    new Widget({
      widgetKey: 'topConvertingCampaigns',
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          table: 'eventSession',
          groupBy: 'session_referralCampaign',
          countOn: 'count(*)',
          where: { session_hasConversion: '1' },
        }),
      layoutHandling: 'list',
      title: 'Top Converting Campaigns',
      description: 'Which campaigns convert best',
      el: elList,
      category: ['conversion'],
    }),

    new Widget({
      widgetKey: 'errorPages',
      queryHandler: () =>
        new QueryPageEvents({
          service,
          event: 'error',
          selectors: ['groupUniqArray(3)([label, trace]) as list'],
        }),
      layoutHandling: 'list',
      title: 'Pages with Errors',
      description: 'The pages on this site where errors were detected.',
      el: elList,
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'topErrors',
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          countOn: 'count(*)',
          table: 'event',
          groupBy: 'label',
          where: { event: 'error' },
          selectors: ['groupUniqArray(3)(trace) as list'],
        }),
      layoutHandling: 'list',
      el: elList,
      title: 'Top Errors',
      description: 'Which errors were most common across your site.',
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'averageRobot',
      layoutHandling: 'chart',
      el,
      title: 'Flagged Bot Percentage',
      description:
        'Percentage of traffic which has been identified as automated',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `round(avg(session_isRobot) * 100, 1) as ${w.widgetKey}`,
        ])
      },
      ui: {
        valueFormat: 'percent',
      },
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'totalRobot',
      layoutHandling: 'chart',
      el,
      title: 'Total Flagged Bots',
      description: 'Number of sessions identified as bots',
      queryHandler: (w) => {
        return QueryWidgetChartSession.selectorsAdd([
          `sum(session_isRobot) as ${w.widgetKey}`,
        ])
      },
      ui: {},
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'topRobotReferrers',
      title: 'Top Bot Referrers',
      description: 'Which sites send most fake traffic',
      layoutHandling: 'list',
      el: elList,
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          table: 'eventSession',
          groupBy: 'session_referrer',
          countOn: 'avg(session_isRobot)',
          noRollup: true,
          selectors: [
            'topK(3)(session_referrer) as url',
            'uniq(session_anonymousId) as uniques',
          ],
        }),
      ui: {
        valueFormat: 'rawPercent',
        aggregationFormat: 'enriched',
      },
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'topRobotCampaign',
      title: 'Top Bot Campaigns',
      description: 'Which campaigns send most fake traffic',
      layoutHandling: 'list',
      el: elList,
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          table: 'eventSession',
          groupBy: 'session_referralCampaign',
          noRollup: true,
          countOn: 'avg(session_isRobot)',
          selectors: [
            'topK(1)(session_referrer) as url',
            'uniq(session_anonymousId) as uniques',
          ],
        }),
      ui: {
        valueFormat: 'rawPercent',
        aggregationFormat: 'enriched',
      },
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'topRobotSource',
      title: 'Top Bot Sources',
      description: 'Which traffic sources send most fake traffic',
      layoutHandling: 'list',
      el: elList,
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          table: 'eventSession',
          noRollup: true,
          groupBy: 'session_referralSource',
          countOn: 'avg(session_isRobot)',
          selectors: [
            'topK(1)(session_referrer) as url',
            'uniq(session_anonymousId) as uniques',
          ],
        }),
      ui: {
        valueFormat: 'rawPercent',
        aggregationFormat: 'enriched',
      },
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'topRobotCities',
      layoutHandling: 'list',
      el: elList,
      title: 'Top Bot Cities',
      description: 'Fake traffic is mostly associated with these cities',
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          table: 'eventSession',
          groupBy: 'session_cityName',
          countOn: 'sum(session_isRobot)',
          selectors: [
            'topK(1)(session_referrer) as url',
            'any(session_countryCode) as countryCode',
            'uniq(session_anonymousId) as uniques',
          ],
        }),
      ui: {
        valueFormat: 'number',
        aggregationFormat: 'city',
      },
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'topRobotCountries',
      layoutHandling: 'list',
      el: elList,
      title: 'Top Bot Countries',
      description: 'Fake traffic is mostly associated with these countries',
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          table: 'eventSession',
          groupBy: 'session_countryCode',
          countOn: 'sum(session_isRobot)',
          selectors: [
            'topK(1)(session_referrer) as url',
            'uniq(session_anonymousId) as uniques',
          ],
        }),
      ui: {
        valueFormat: 'number',
        aggregationFormat: 'country',
      },
      category: ['technical'],
    }),
    new Widget({
      widgetKey: 'topRobotIps',
      layoutHandling: 'list',
      el: elList,
      title: 'Top Bot IP Addresses',
      description: 'These IP addresses are associated with fake traffic',
      queryHandler: () =>
        new QueryWidgetAggregation({
          service,
          table: 'eventSession',
          groupBy: 'session_ip',
          countOn: 'sum(session_isRobot)',
          selectors: [
            'topK(1)(session_referrer) as url',
            'uniq(session_anonymousId) as uniques',
          ],
        }),
      ui: {
        valueFormat: 'number',
      },
      category: ['technical'],
    }),
  ]
}
