import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

const templateId = 'CardParallaxScrollV1'

export const template = cardTemplate({
  templateId,
  tags: ['content'],
  frequency: 'niche',
  title: 'Parallax Scroll',
  description: 'Create an immersive visual journey with parallax scrolling and sticky content. Perfect for storytelling, product showcases, or virtual tours that guide visitors through a compelling narrative.',
  subTitle: 'Transform your story into an engaging visual experience that captures attention and drives engagement',
  icon: 'i-tabler-route',
  colorTheme: 'cyan',
  isPublic: true,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),

  async getConfig(args) {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },

  // Set optimal default spacing
  getBaseConfig: () => {
    return {
      standard: {
        widthSize: 'none',
        spaceSize: 'sm',
      } as const,
    }
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { UserConfig } from './config'
