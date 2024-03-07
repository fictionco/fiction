// @unocss-include

import { vue } from '@fiction/core'
import { CardTemplate } from '../card'
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
import { templates as templatesFeatures } from './features'

export const standardCardTemplates = [
  new CardTemplate({
    templateId: 'wrap',
    el: vue.defineAsyncComponent(() => import('../engine/XWrap.vue')),
  }),
  ...templates404,
  ...templatesQuote,
  ...templatesHero,
  ...templatesMarquee,
  ...templatesArea,

] as const

export const marketingCardTemplates = [
  ...templatesLogos,
  ...templatesTour,
  ...templatesMediaGrid,
  ...templatesFeatures,
  ...templatesMetrics,
  ...templatesDoc,
] as const
