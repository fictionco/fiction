import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

const templateId = 'cardCinemaSliderV1'

export const template = cardTemplate({
  templateId,
  title: 'Cinema Slider',
  subTitle: 'Create immersive full-screen presentations with background videos and images',
  description: 'Perfect for photography portfolios, event promotion, product launches, or any content that benefits from dramatic full-screen visuals with overlaid text and calls-to-action.',
  category: ['marketing', 'portfolio', 'media'],
  icon: 'i-tabler-movie',
  colorTheme: 'rose',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  getBaseConfig: () => ({ standard: { widthSize: 'none', spaceSize: 'none' } }),
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { CinemaItem, UserConfig } from './config'
