import { vue } from '@fiction/core/index.js'
import { CardFactory } from '@fiction/site/cardFactory.js'
import { templates } from '../templates.js'

export async function page() {
  const factory = new CardFactory({ templates })

  const homeCard = await factory.create({
    el: vue.defineAsyncComponent(async () => import('./el/ElCard.vue')),
    userConfig: { standard: { spacing: { verticalSpacing: 'none' } } },
  })

  return factory.create({
    regionId: 'main',
    templateId: 'wrap',
    slug: 'affiliate',
    cards: [
      await factory.create({ templateId: 'area', cards: [homeCard] }),
    ],
  })
}
