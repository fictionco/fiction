import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { inputSets } from '@fiction/site/cards/inputSets'
import { CardTemplate } from '@fiction/site/card'
import { marketingCardTemplates, standardCardTemplates } from '@fiction/site/cards'

const def = vue.defineAsyncComponent

export const templates = [
  new CardTemplate({
    templateId: 'fictionHeader',
    el: def(() => import('./el/ElHeader.vue')),

    options: [
      new InputOption({ key: 'logoUrl', label: 'Logo', input: 'InputMediaDisplay' }),
      ...inputSets.navItemList({ label: 'Nav', parentKey: 'nav' }),
      ...inputSets.actions({ label: 'Nav', parentKey: 'nav' }),
      ...inputSets.navItemList({ label: 'Socials (Mobile)', parentKey: 'socialList' }),
    ],
    userConfig: {
      spacing: { spacingClass: 'py-0' },
    },
  }),
  new CardTemplate({
    templateId: 'fictionFooter',
    el: def(() => import('./el/ElFooter.vue')),
    options: [],
  }),
  ...standardCardTemplates,
  ...marketingCardTemplates,
] as const
