import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'cardStandardFooterV1'

export const template = cardTemplate({
  templateId,
  category: ['navigation'],
  icon: 'i-tabler-menu-2',
  title: 'Footer',
  subTitle: 'Standard minimal footer',
  colorTheme: 'green',
  isPublic: false,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  getConfig: async (args) => {
    return {}
  },

})
