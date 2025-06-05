import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

const templateId = 'cardManageContactV1'

export const template = cardTemplate({
  templateId,
  el: vue.defineAsyncComponent(async () => import('./XCard.vue')),
  getBaseConfig: () => {
    return { standard: { showOnSingle: true } }
  },
  isPublic: false,
  isPageCard: true,
})
