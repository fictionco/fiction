import type { DocGroupRecord } from '@factor/plugin-docs-engine'
import { Doc } from '@factor/plugin-docs-engine'

/// <reference path="@factor/api/shim.d.ts" />
import { docs as devDocs, group as devGroup } from './developer/map'

export const docs = [
  new Doc({
    key: 'install',
    fileImport: () => import('./get-started/install/install.md'),
  }),

  new Doc({
    key: 'eventsGoals',
    title: 'Goals and Events',
    fileImport: () => import('./analytics/eventsGoals/index.md'),
  }),
  new Doc({
    key: 'projectSettings',
    title: 'Project Settings',
    fileImport: () => import('./analytics/projectSettings/index.md'),
  }),
  new Doc({
    key: 'analyticsOverview',
    title: 'Analytics Overview',
    fileImport: () => import('./analytics/overview/index.md'),
  }),

  new Doc({
    key: 'dashboard',
    title: 'The Dashboard',
    fileImport: () => import('./analytics/dashboard/index.md'),
  }),
  new Doc({
    key: 'trafficReports',
    title: 'Traffic and Reports',
    fileImport: () => import('./analytics/trafficReports/index.md'),
  }),
  new Doc({
    key: 'heatmaps',
    title: 'Heatmaps',
    fileImport: () => import('./analytics/heatmaps/index.md'),
  }),

  new Doc({
    key: 'sessionReplay',
    title: 'Session Replay',
    fileImport: () => import('./analytics/sessionReplay/index.md'),
  }),
  new Doc({
    key: 'behaviorTracking',
    title: 'Interactions and Behavior',
    fileImport: () => import('./analytics/behaviorTracking/index.md'),
  }),
  new Doc({
    key: 'performanceDebugging',
    title: 'Monitor and Debug',
    fileImport: () => import('./analytics/performanceDebugging/index.md'),
  }),
  new Doc({
    key: 'privacy',
    title: 'Your Privacy and Kaption',
    fileImport: () => import('./legal/your-privacy/index.md'),
  }),
  new Doc({
    key: 'tos',
    title: 'Terms of Service',
    fileImport: () => import('./legal/terms/index.md'),
  }),
  new Doc({
    key: 'privacyPolicy',
    title: 'Privacy Policy',
    fileImport: () => import('./legal/privacy/index.md'),
  }),
  new Doc({
    key: 'gdpr',
    title: 'GDPR Commitment',
    fileImport: () => import('./legal/gdpr/index.md'),
  }),
  new Doc({
    key: 'ccpa',
    title: 'CCPA Commitment',
    fileImport: () => import('./legal/ccpa/index.md'),
  }),
  new Doc({
    key: 'affiliateTerms',
    title: 'Affiliate Terms',
    fileImport: () => import('./legal/affiliate/index.md'),
  }),

  ...devDocs,
]

export type DocKeysUnion<T extends Doc<string>[]> = {
  [K in keyof T]: T[K] extends Doc<infer T> ? T : never
}[number]

export type DocKeys = DocKeysUnion<typeof docs>

export const groups: DocGroupRecord<DocKeys> = {
  docs: {
    title: 'Docs Home',
    description: `Explore everything you can do with Kaption.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>`,
    path: '/docs',
  },
  getStarted: {
    title: 'Get Started',
    description: `Learn how to install the tracking script and get Kaption set up in your project.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>`,
    path: '/docs/install',
    menu: ['install'],
  },
  settingUp: {
    title: 'Setting Up',
    path: '/docs/events-goals',
    description: `How to set up Kaption to take advantage of custom goals, conversion events and enhanced tracking settings.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>`,
    menu: ['eventsGoals', 'projectSettings'],
  },
  analytics: {
    title: 'Analytics Tools',
    path: '/docs/analytics-overview',
    description: `Learn how to use and work with Kaption's web analytics including heatmaps, replays and more.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg"   fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>`,
    menu: [
      'analyticsOverview',
      'dashboard',
      'trafficReports',
      'heatmaps',
      'sessionReplay',
      'behaviorTracking',
      'performanceDebugging',
    ],
  },
  ...devGroup,
  legal: {
    title: 'Privacy and Legal',
    path: '/docs/privacy',
    description:
      'Understand Kaption\'s approach to privacy, security, and compliance.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>`,
    menu: ['privacy', 'tos', 'privacyPolicy', 'gdpr', 'ccpa', 'affiliateTerms'],
  },
}
