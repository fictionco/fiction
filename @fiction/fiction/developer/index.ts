import type { Site } from '@fiction/site/site.js'
import { cardConfig } from '@fiction/cards'
import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export async function page({ site }: { site: Site }) {
  const el = vue.defineAsyncComponent(() => import('./el/ElCard.vue'))
  site.theme.value.templates.push(cardTemplate({ templateId: 'devPageTpl', el }))

  const devPage = await cardConfig<any>({
    templateId: 'devPageTpl',
    userConfig: { standard: { title: 'FictionOS' } },
  })

  return cardConfig({
    regionId: 'main',
    templateId: 'cardPageWrapV1',
    slug: 'developer',
    cards: [devPage],
  })
}
