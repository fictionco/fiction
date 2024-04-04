import { type ServiceList, vue } from '@fiction/core'
import { CardTemplate } from '@fiction/site/card'
import { createCard } from '@fiction/site/theme'

import { templates } from './templates'

export function getPage(_args: ServiceList) {
  return createCard({
    templates,
    regionId: 'main',
    slug: '_home',
    tpl: new CardTemplate({
      templateId: 'sites',
      el: vue.defineAsyncComponent(() => import('@fiction/site/plugin-builder/ViewIndex.vue')),
    }),
  })
}
