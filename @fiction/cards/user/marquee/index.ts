import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

export const templateId = 'cardMarqueeV1'

export const template = cardTemplate({
  templateId,
  tags: ['media', 'slider'],
  frequency: 'niche',
  title: 'Media Marquee',
  description: 'Create engaging, animated media showcases with smooth scrolling effects. Perfect for portfolios, product galleries, or featured content that captures attention through fluid motion.',
  subTitle: 'Transform static galleries into captivating motion displays',
  icon: 'i-tabler-carousel-horizontal',
  colorTheme: 'pink',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElMarquee.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})
