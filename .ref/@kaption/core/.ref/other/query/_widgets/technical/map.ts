import { mapTypeHelper } from '../helpers'

export const map = mapTypeHelper({
  layoutShift: {
    title: 'Layout Shift (CLS)',
    description:
      'Measures visual stability. Cumulative layout shift (CLS) is a web vital describing the amount your layout shifts as it loads. To provide a good user experience, pages should maintain a CLS of 0.1. or less.',
    table: 'eventSession',
    groupBy: 'interval',
    selector: [
      'round(avgIf(session_vitalCLS, session_vitalCLS > 0), 2) as layoutShift',
    ],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>`,
  },
  firstInputDelay: {
    title: 'First Input Delay (FID)',
    description:
      'Measures interactivity. To provide a good user experience, pages should have a FID of 100 milliseconds or less.',
    table: 'eventSession',
    groupBy: 'interval',
    valueFormat: 'microDuration',
    selector: [
      'round(avgIf(session_vitalFID, session_vitalFID > 0), 2) as firstInputDelay',
    ],
    queryFormat: 'chart',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  },
  largestContentfulPaint: {
    title: 'Largest Contentful Paint (LCP)',
    description:
      'Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.',
    table: 'eventSession',
    groupBy: 'interval',
    selector: [
      'round(avgIf(session_vitalLCP, session_vitalLCP > 0), 2) as largestContentfulPaint',
    ],
    queryFormat: 'chart',
    valueFormat: 'microDuration',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  },
  totalBlockingTime: {
    title: 'Total Blocking Time (TBT)',
    description:
      'The Total Blocking Time (TBT) metric measures the total amount of time between First Contentful Paint (FCP) and Time to Interactive (TTI) where the main thread was blocked for long enough to prevent input responsiveness.',
    table: 'eventSession',
    groupBy: 'interval',
    selector: [
      'round(avgIf(session_vitalTBT, session_vitalTBT > 0)) as totalBlockingTime',
    ],
    queryFormat: 'chart',
    valueFormat: 'microDuration',
    pro: true,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  },
  errorPages: {
    title: 'Pages with Errors',
    description: 'The pages on this site where errors were detected.',
    groupBy: 'pathname',
    queryFormat: 'errorAggregation',
    countOn: 'sum(hasError)',

    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>`,
    custom: true,
    pro: true,
  },
  topErrors: {
    title: 'Top Errors',
    description: 'Which errors were most common across your site.',
    groupBy: 'label',
    where: { eventName: 'error' },
    selector: ['groupUniqArray(3)(trace) as list'],
    queryFormat: 'aggregation',
    countOn: 'count(*)',
    table: 'event',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>`,
    custom: true,
    pro: true,
  },
})
