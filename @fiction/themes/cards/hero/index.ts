// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate, createCard } from '@fiction/site'
import { standardOption } from '../inputSets'
import type { UserConfig } from './ElHero.vue'

const templateId = 'hero'

const defaultContent: UserConfig = {
  heading: 'Short Catchy Heading',
  subHeading: 'Description of the heading. Typically a sentence or two.',
  superHeading: 'Category or Tagline',
  actions: [{ name: 'Primary', href: '/', btn: 'primary' }, { name: 'Secondary', href: '/learn-more', btn: 'default' }],
}

export const templates = [
  new CardTemplate({
    templateId,
    category: ['basic'],
    isPublic: true,
    description: 'standard hero section',
    icon: 'i-tabler-layout-bottombar-collapse-filled',
    iconTheme: 'orange',
    el: vue.defineAsyncComponent(() => import('./ElHero.vue')),
    options: [
      standardOption.headers({}),
      standardOption.layout(),
      standardOption.media({ key: 'splash', label: 'Splash Image' }),
      standardOption.actionItems(),
      standardOption.ai(),
    ],
    userConfig: defaultContent,
  }),
] as const

export function demo() {
  const splash = { url: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?q=80&w=3864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
  const subHeading = 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
  return createCard({
    slug: 'card-hero',
    cards: [
      createCard({ templateId, templates, userConfig: { } }),
      createCard({ templateId, templates, userConfig: { ...defaultContent, layout: 'justify', splash } }),
      createCard({ templateId, templates, userConfig: { ...defaultContent, layout: 'right', splash, subHeading } }),
      createCard({ templateId, templates, userConfig: { ...defaultContent, layout: 'left', splash, subHeading } }),
    ],
  })
}
