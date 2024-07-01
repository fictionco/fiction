import { vue } from '@fiction/core/index.js'
import { CardTemplate } from '@fiction/site/card.js'
import { marketingCardTemplates, standardCardTemplates } from '@fiction/cards'

const def = vue.defineAsyncComponent

export const templates = [
  new CardTemplate({
    templateId: 'fictionHeader',
    el: def(async () => import('./el/ElHeader.vue')),
    options: [],
    userConfig: {
      spacing: { spacingClass: 'py-0' },
    },
  }),
  new CardTemplate({
    templateId: 'fictionFooter',
    el: def(async () => import('./el/ElFooter.vue')),
    options: [],
  }),
  ...standardCardTemplates,
  ...marketingCardTemplates,
] as const
