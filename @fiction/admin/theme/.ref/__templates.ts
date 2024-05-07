import type { FictionEnv } from '@fiction/core'
import { vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'
import { FictionCards } from '@fiction/cards'

const def = vue.defineAsyncComponent

export function getTemplates(args: { fictionEnv: FictionEnv }) {
  const fictionCards = new FictionCards(args)
  return [
    new CardTemplate({
      templateId: 'sites',
      el: def(() => import('@fiction/site/plugin-builder/ViewIndex.vue')),
    }),
    ...fictionCards.standard,
  ] as const
}
