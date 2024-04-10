// @unocss-include

import { envConfig, safeDirname, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'
import { templates as templates404 } from './404'
import { templates as templatesQuote } from './quote'
import { templates as templatesLogos } from './logos'
import { templates as templatesHero } from './hero'
import { templates as templatesDoc } from './doc'
import { templates as templatesMarquee } from './marquee'
import { templates as templatesArea } from './area'
import { templates as templatesTour } from './tour'
import { templates as templatesMediaGrid } from './media-grid'
import { templates as templatesMetrics } from './metrics'
import * as features from './features'
import * as team from './team'
import * as map from './map'
import * as faq from './faq'
import * as pricing from './pricing'
/**
 * Add path for tailwindcss to scan for styles
 */
envConfig.register({ name: 'CARD_UI_ROOT', onLoad: ({ fictionEnv }) => { fictionEnv.addUiRoot(safeDirname(import.meta.url)) } })

export const standardCardTemplates = [
  new CardTemplate({
    templateId: 'wrap',
    el: vue.defineAsyncComponent(() => import('./CardWrap.vue')),
  }),
  ...templates404,
  ...templatesQuote,
  ...templatesHero,
  ...templatesMarquee,
  ...templatesArea,

] as const

export const marketingCardTemplates = [
  ...team.templates,
  ...pricing.templates,
  ...templatesLogos,
  ...templatesTour,
  ...templatesMediaGrid,
  ...features.templates,
  ...templatesMetrics,
  ...templatesDoc,
  ...map.templates,
  ...faq.templates,
] as const

export function pages() {
  return [
    team.page(),
  ]
}
