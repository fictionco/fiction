import type { FictionEnv } from '@fiction/core'
import { envConfig, safeDirname, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'
import { z } from 'zod'
import type { CardConfigPortable } from '@fiction/site'
import * as four04 from './404'
import * as quote from './quote'
import { templates as templatesLogos } from './logos'
import * as hero from './hero'

import * as area from './area'
import * as tour from './tour'
import * as profile from './profile'
import { templates as templatesMediaGrid } from './media-grid'
import * as metrics from './metrics'
import * as features from './features'
import * as team from './team'
import * as map from './map'
import * as faq from './faq'
import * as pricing from './pricing/index.js'
import * as marquee from './marquee/index.js'
import * as magazine from './magazine/index.js'
import * as capture from './capture/index.js'
import * as showcase from './showcase/index.js'
import { createDemoPage } from './utils/demo'
/**
 * Add path for tailwindcss to scan for styles
 */
envConfig.register({ name: 'CARD_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

export const standardCardTemplates = [
  new CardTemplate({
    templateId: 'wrap',
    el: vue.defineAsyncComponent(() => import('./CardWrap.vue')),
    schema: z.object({}),
    isPublic: false,
  }),
  new CardTemplate({
    templateId: 'transaction',
    el: vue.defineAsyncComponent(() => import('./CardWrapTransaction.vue')),
    schema: z.object({}),
    isPublic: false,
  }),
  ...four04.templates,
  ...quote.templates,
  ...profile.templates,
  ...hero.templates,
  ...marquee.templates,
  ...area.templates,
  ...map.templates,
  ...magazine.templates,
  ...capture.templates,
  ...showcase.templates,
] as const

export const marketingCardTemplates = [
  ...team.templates,
  ...pricing.templates,
  ...templatesLogos,
  ...tour.templates,
  ...templatesMediaGrid,
  ...features.templates,
  ...metrics.templates,
  ...faq.templates,
] as const

export function getDemoPages(args: { templates: CardTemplate[] | readonly CardTemplate[], fictionEnv: FictionEnv }) {
  const { templates } = args

  const inlineDemos = templates.filter(t => t.settings.demoPage).map((t) => {
    const cards = t.settings.demoPage?.() as CardConfigPortable[]
    return createDemoPage({ templateId: t.settings.templateId, template: t, cards })
  })

  return [
    marquee.demo(),
    hero.demo(),
    profile.demo(),
    map.demo(),
    quote.demo(),
    area.demo(),
    magazine.demo(),
    capture.demo(),
    ...inlineDemos,
  ]
}
