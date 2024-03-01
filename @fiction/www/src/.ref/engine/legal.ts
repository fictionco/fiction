import type { RegionEntry } from '@factor/engine'
import type { MenuGroup } from '@factor/api'
import { vue } from '@factor/api'

const menu: MenuGroup[] = [
  {
    groupName: 'Legal',
    menu: [
      {
        name: 'Privacy Policy',
        href: '/privacy',
      },
      {
        name: 'Terms of Service',
        href: '/terms',
      },
    ],
  },
]

export const config: RegionEntry[] = [
  {
    id: 'p1',
    route: '/privacy',
    layout: [
      {
        id: 'x',
        el: vue.defineAsyncComponent(() => import('./sections/ElDoc.vue')),
        settings: {
          menu,
          markdownFile: () => import('./content/privacy.md'),
        },
      },
    ],
  },
  {
    id: 'p1',
    route: '/terms',
    layout: [
      {
        id: 'x',
        el: vue.defineAsyncComponent(() => import('./sections/ElDoc.vue')),
        settings: {
          menu,
          markdownFile: () => import('./content/terms.md'),
        },
      },
    ],
  },
]
