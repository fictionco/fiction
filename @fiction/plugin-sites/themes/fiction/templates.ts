import { vue } from '@fiction/core'
import { InputOption } from '@fiction/ui'
import { inputSets } from '../../cards/inputSets'
import { CardTemplate } from '../../card'
import { marketingCardTemplates, standardCardTemplates } from '../../cards'

const def = vue.defineAsyncComponent

export const templates = [
  new CardTemplate({
    templateId: 'fictionHeader',
    el: def(() => import('./el/ElHeader.vue')),
    spacingClass: 'py-0',
    options: [
      new InputOption({ key: 'logoUrl', label: 'Logo', input: 'InputMediaDisplay' }),
      ...inputSets.navItemList({ label: 'Nav', parentKey: 'nav' }),
      ...inputSets.actions({ label: 'Nav', parentKey: 'nav' }),
      ...inputSets.navItemList({ label: 'Socials (Mobile)', parentKey: 'socialList' }),
    ],
  }),
  new CardTemplate({
    templateId: 'fictionFooter',
    el: def(() => import('./el/ElFooter.vue')),
    options: [],
  }),
  ...standardCardTemplates,
  ...marketingCardTemplates,
] as const
