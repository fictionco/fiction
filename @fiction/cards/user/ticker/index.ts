import { vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card'

export const templateId = 'cardTickerV1'

// Main template definition with minimal synchronous code
export const template = cardTemplate({
  templateId,
  tags: ['content'],
  frequency: 'standard',
  icon: 'i-tabler-arrow-autofit-width',
  title: 'Animated Ticker',
  description: 'Create eye-catching scrolling announcements with 3D effects, custom fonts, and scroll-reactive animations. Perfect for highlighting time-sensitive offers, news updates, or key messages that demand attention.',
  subTitle: 'Transform static announcements into dynamic, engaging messages that capture your audience\'s attention',
  colorTheme: 'blue',
  isPublic: true,

  // Async component loading
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),

  // Config implementation
  getConfig: async () => {
    const { getConfig } = await import('./config')
    return getConfig({ templateId })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

// Export types for use in other components
export type { UserConfig } from './config'
