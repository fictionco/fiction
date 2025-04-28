import { safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'cardSinglePostV1'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  tags: ['blog'],
  frequency: 'standard',
  icon: 'i-tabler-notebook',
  title: 'Blog',
  subTitle: 'Single Post',
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
  isPublic: false,
  getBaseConfig: () => {
    return { standard: { showOnSingle: true } }
  },
  getConfig: async () => {
    return {}
  },
})
