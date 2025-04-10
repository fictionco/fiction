import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'cardTransactionViewV1'

export const template = cardTemplate({
  templateId,
  el: vue.defineAsyncComponent(async () => import('./CardWrapTransaction.vue')),
  getBaseConfig: () => {
    return { standard: { showOnSingle: true } }
  },
  isPublic: false,
  isPageCard: true,
})
