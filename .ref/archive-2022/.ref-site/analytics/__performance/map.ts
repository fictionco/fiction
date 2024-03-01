import type { Component } from 'vue'
import { defineAsyncComponent as def } from 'vue'
import { mapTypeHelper } from '../../util'
import screenPerformance from './img/screenPerformance.webp'
import thumbDebugging from './img/thumbDebugging.webp'

export const map = mapTypeHelper({
  performance: {
    header: 'full',
    class: 'text-green-500',
    bgClass: 'bg-green-50',
    path: '/platform/performance',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 250 250"><g transform="matrix(17.857142857142858,0,0,17.857142857142858,0,0)"><path fill="" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M.96 10.268a3.132 3.132 0 002.753 2.76c1.07.12 2.167.222 3.287.222s2.218-.102 3.287-.222a3.132 3.132 0 002.753-2.76c.114-1.063.21-2.155.21-3.268s-.096-2.205-.21-3.269a3.132 3.132 0 00-2.753-2.76C9.217.853 8.12.75 7 .75S4.782.852 3.713.972A3.132 3.132 0 00.96 3.732C.846 4.794.75 5.886.75 7s.096 2.205.21 3.268z"></path><path fill="#D7E0FF" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.068 4H.932l.028-.269A3.132 3.132 0 013.713.971C4.783.853 5.88.75 7 .75s2.218.102 3.287.222a3.132 3.132 0 012.753 2.76c.01.089.02.178.028.268z"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.25 6.95l-1.5 1.5 1.5 1.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.75 6.95l1.5 1.5-1.5 1.5"></path><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.25 10.45l1.5-4.5"></path></g></svg>`,
    name: 'Debugging',
    tagline: 'Detect errors and slowdowns',
    screenshot: screenPerformance,
    thumb: thumbDebugging,
    description:
      'Kaption triggers events on errors and tracks your website vitals over time',
    category: 'Analytics',
    aspects: [
      {
        align: 'wide',
        tagline: 'Debugging Made Simple',
        name: 'Debugging is a headache without visualization.',
        description: `JavaScript errors can be hard to reproduce, as often they are specific to an environment. Use Kaption to isolate identify where errors are happening and their root cause.`,

        figure: def<Component>(
          () => import('./AnalyticsPerformanceErrors.vue'),
        ),
      },
      {
        align: 'wide',
        tagline: 'Page Vitals',
        name: 'Measure Vitals and Network Performance',
        description: `Page performance is important for SEO. Use Kaption to monitor which requests are slow across the spectrum of your visitors and then take action.`,
        figure: def<Component>(
          () => import('./AnalyticsPerformanceFigure.vue'),
        ),
      },
    ],
  },
})
