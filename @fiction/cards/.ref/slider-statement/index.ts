import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'cardStatementSliderV1'

export type { Statement, UserConfig } from './config'

export const template = cardTemplate({
  templateId,
  category: ['content', 'marketing'],
  title: 'Statement Slides',
  description: 'Transform your key messages into captivating statements that command attention. Perfect for showcasing testimonials, company values, or product benefits in an engaging, interactive format.',
  subTitle: 'Create a sequence of powerful messages that guide your audience and drive action',
  icon: 'i-tabler-message-circle-2',
  colorTheme: 'indigo',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },

  getBaseConfig: () => {
    return { standard: { spaceSize: 'xl' } }
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})
