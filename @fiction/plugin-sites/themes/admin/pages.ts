import { type ServiceList, vue } from '@fiction/core'
import { CardTemplate } from '../../card'
import { themeCard } from '../../theme'

import { templates } from './templates'

export function getPage(_args: ServiceList) {
  return themeCard({
    templates,
    regionId: 'main',
    slug: '_default',
    tpl: new CardTemplate({
      templateId: 'sites',
      el: vue.defineAsyncComponent(() => import('../../el/ViewIndex.vue')),
    }),
  })
}
