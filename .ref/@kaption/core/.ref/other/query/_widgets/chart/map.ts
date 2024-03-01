import { mapTypeHelper } from '../helpers'

const icon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
</svg>`

export const map = mapTypeHelper({
  uniqueVisitors: {
    title: 'Unique Visitors',
    description: 'Chart of unique visitors over time',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['uniq(session_clientId) as uniqueVisitors'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>`,
    custom: true,
  },
  returningVisitors: {
    title: 'Returning Visitors',
    description:
      'Amount of users that have visited your site previously (without clearing browsing data)',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['uniqIf(session_clientId, isReturning) as returningVisitors'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
  </svg>`,
    custom: true,
  },
  engageDuration: {
    title: 'Average Time Engaged',
    description:
      'Average amount of time a visitor spent interactively engaging with your site',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['round(avg(session_engageDuration), 1) as engageDuration'],
    queryFormat: 'chart',
    valueFormat: 'duration',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
    custom: true,
  },
  sessionDuration: {
    title: 'Session Duration',
    description: 'The average time from beginning to end of a session',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['round(avg(session_duration), 1) as sessionDuration'],
    queryFormat: 'chart',
    valueFormat: 'duration',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
    custom: true,
  },
  bounceRate: {
    title: 'Average Bounce Rate',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['round(avg(isBounce) * 100, 1) as bounceRate'],
    queryFormat: 'chart',
    valueFormat: 'percent',
    changeFormat: 'inverse',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>`,
    custom: true,
  },
  uniqueSessions: {
    title: 'Total Sessions',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['count(*) as uniqueSessions'],
    queryFormat: 'chart',
    icon,
    custom: true,
  },
  totalViews: {
    title: 'Total Page Views',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(pageCount) as totalViews'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>`,
    custom: true,
  },
  averageViews: {
    title: 'Page Views / Session',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['round(avg(pageCount), 1) as averageViews'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>`,
    custom: true,
  },
  totalEvents: {
    title: 'Total Events',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(eventCount) as totalEvents'],
    queryFormat: 'chart',
    icon,
    custom: true,
  },
  averageEvents: {
    title: 'Events / Session',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['round(avg(eventCount), 1) as averageEvents'],
    queryFormat: 'chart',
    icon,
    custom: true,
  },
  totalScrolls: {
    title: 'Total Scrolls',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(session_scrollTotal) as totalScrolls'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
  </svg>`,
    custom: true,
    pro: true,
  },
  averageScrolls: {
    title: 'Scrolls per Session',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['avg(session_scrollTotal) as averageScrolls'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
  </svg>`,
    custom: true,
  },
  averageScrollDepth: {
    title: 'Average Scroll Depth',
    table: 'eventSession',
    groupBy: 'interval',
    selector: [
      'avgIf(session_scrollDepth, isFinite(session_scrollDepth)) as averageScrollDepth',
    ],
    queryFormat: 'chart',
    valueFormat: 'percent',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 13l-7 7-7-7m14-8l-7 7-7-7" />
  </svg>`,
    custom: true,
    pro: true,
  },
  totalClicks: {
    title: 'Total Clicks',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(session_clickTotal) as totalClicks'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>`,
    custom: true,
  },
  averageClicks: {
    title: 'Clicks Per Session',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['round(avg(session_clickTotal), 1) as averageClicks'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
  </svg>`,
    custom: true,
  },
  totalTouches: {
    title: 'Total Touches',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['sum(session_touchTotal) as totalTouches'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
  </svg>`,
    custom: true,
    pro: true,
  },
  averageTouches: {
    title: 'Touches per Session',
    description: 'Amount of touch events per session on average',
    table: 'eventSession',
    groupBy: 'interval',
    selector: ['round(avg(session_touchTotal), 1) as averageTouches'],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
  </svg>`,
    custom: true,
    pro: true,
  },
})
