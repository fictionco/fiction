import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'
import { getQueries } from './queries'

const templateId = 'cardInstaV1'

export const template = cardTemplate({
  templateId,
  category: ['social'],
  description: 'Instagram galleries for your site',
  icon: 'i-tabler-image',
  colorTheme: 'rose',
  isPublic: false,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getQueries,
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
})
