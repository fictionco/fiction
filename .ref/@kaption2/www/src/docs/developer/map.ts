import type { DocGroupRecord } from '@factor/plugin-docs-engine'
import { Doc } from '@factor/plugin-docs-engine'
import ElTable from './overview/ElTable.vue'

export const group: DocGroupRecord<DocKeys> = {
  developer: {
    title: 'Developer API',
    path: '/docs/api-overview',
    description: `Kaption's developer API with deep support for all different types of tracking and monitoring.`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg"   fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>`,
    menu: [
      'apiOverview',
      'client',
      'identification',
      'track',
      'group',
      'commonFields',
    ],
  },
}

export type DocKeysUnion<T extends Doc<string>[]> = {
  [K in keyof T]: T[K] extends Doc<infer T> ? T : never
}[number]

export type DocKeys = DocKeysUnion<typeof docs>

export const docs = [
  new Doc({
    key: 'apiOverview',
    title: 'API Overview',
    fileImport: () => import('./overview/doc.md'),
  }),
  new Doc({
    key: 'client',
    title: 'JavaScript Client',
    fileImport: () => import('./overview/client.md'),
  }),

  new Doc({
    key: 'identification',
    title: 'Identification',
    fileImport: () => import('./overview/identification.md'),
    components: { ElTable },
  }),
  new Doc({
    key: 'track',
    title: 'Tracking Events',
    fileImport: () => import('./overview/track.md'),
    components: { ElTable },
  }),
  new Doc({
    key: 'group',
    title: 'Grouping Users',
    fileImport: () => import('./overview/group.md'),
    components: { ElTable },
  }),
  new Doc({
    key: 'commonFields',
    title: 'Common Fields',
    fileImport: () => import('./overview/commonFields.md'),
    components: { ElTable },
  }),
]
