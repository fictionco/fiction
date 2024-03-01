import type { DocGroupRecord } from '@factor/plugin-docs-engine'
import { Doc } from '@factor/plugin-docs-engine'

export const docs = [
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
]

export type DocKeysUnion<T extends Doc<string>[]> = {
  [K in keyof T]: T[K] extends Doc<infer T> ? T : never
}[number]

export type DocKeys = DocKeysUnion<typeof docs>

export const groups: DocGroupRecord<DocKeys> = {
  docs: {
    title: 'Docs Home',
    description: `Explore Fiction documentation`,
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>`,
    path: '/docs',
  },

  legal: {
    title: 'Privacy and Legal',
    path: '/docs/privacy',
    description: 'Fiction\'s privacy, security, and compliance docs.',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
  </svg>`,
    menu: ['tos', 'privacyPolicy'],
  },
}
