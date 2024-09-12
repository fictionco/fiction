import { vue } from '@fiction/core'
import { CardFactory } from '@fiction/site/cardFactory'
import { templates } from '../templates'

export async function page() {
  const factory = new CardFactory({ templates })

  const homeCard = await factory.create({
    el: vue.defineAsyncComponent(async () => import('./el/ElCard.vue')),
    userConfig: {
      standard: { spacing: { verticalSpacing: 'none' } },
    },
  })

  return await factory.create({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'developer',
    cards: [
      await factory.create({ templateId: 'area', cards: [homeCard] }),

    ],
  })
}
