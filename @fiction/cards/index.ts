import type { FictionEnv } from '@fiction/core'
import { envConfig, safeDirname, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'
import type { Site } from '@fiction/site/site.js'
import { z } from 'zod'
import type { CardConfigPortable } from '@fiction/site'
import * as four04 from './404'
import * as quote from './quote'
import { templates as templatesLogos } from './logos'
import * as hero from './hero'
import * as mediaPop from './mediaPop'
import * as area from './area'
import * as tour from './tour'
import * as profile from './profile'
import { templates as templatesMediaGrid } from './media-grid'
import * as metrics from './metrics'
import * as features from './features'
import * as people from './people'
import * as map from './map'
import * as faq from './faq'
import * as pricing from './pricing/index.js'
import * as marquee from './marquee/index.js'
import * as magazine from './magazine/index.js'
import * as capture from './capture/index.js'
import * as showcase from './showcase/index.js'
import * as nav from './nav/index.js'
import * as footer from './footer/index.js'
import * as cinema from './cinema/index.js'
import * as story from './story/index.js'
import * as ticker from './ticker/index.js'
import * as wrap from './wrap/index.js'
import * as trek from './trek/index.js'
import * as fitText from './fitText/index.js'
import * as overSlide from './overSlide/index.js'
import * as statement from './statement/index.js'
import * as testimonials from './testimonials/index.js'
import * as effectShape from './effect-shape/index.js'
import * as mason from './gallery/index.js'

import { createDemoPage } from './utils/demo'
/**
 * Add path for tailwindcss to scan for styles
 */
envConfig.register({ name: 'CARD_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

export const standardCardTemplates = [
  ...wrap.templates,
  new CardTemplate({
    templateId: 'transaction',
    el: vue.defineAsyncComponent(async () => import('./CardWrapTransaction.vue')),
    schema: z.object({}),
    isPublic: false,
    isPageCard: true,
  }),
  ...four04.templates,
  ...nav.templates,
  ...footer.templates,
  ...quote.templates,
  ...profile.templates,
  ...hero.templates,
  ...marquee.templates,
  ...area.templates,
  ...map.templates,
  ...magazine.templates,
  ...capture.templates,
  ...showcase.templates,
  ...cinema.templates,
  ...story.templates,
  ...ticker.templates,
  ...people.templates,
  ...pricing.templates,
  ...templatesLogos,
  ...tour.templates,
  ...templatesMediaGrid,
  ...features.templates,
  ...metrics.templates,
  ...faq.templates,
  ...mediaPop.templates,
  ...trek.templates,
  ...fitText.templates,
  ...overSlide.templates,
  ...statement.templates,
  ...testimonials.templates,
  ...effectShape.templates,
  ...mason.templates,
] as const

export async function getCardTemplates() {
  return standardCardTemplates
}

export async function getDemoPages(args: { site: Site, templates: CardTemplate[] | readonly CardTemplate[], fictionEnv?: FictionEnv }) {
  const { templates, site } = args

  const promises = templates.filter(t => t.settings.demoPage).map(async (t) => {
    const card = await t.settings.demoPage?.(args) as CardConfigPortable
    const pg = await createDemoPage({ site, templateId: t.settings.templateId, template: t, card })

    return pg
  })

  const inlineDemos = await Promise.all(promises)

  return inlineDemos
}
