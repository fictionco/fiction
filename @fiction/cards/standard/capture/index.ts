import { safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site'

export const templateId = 'cardCaptureV1'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  title: 'Subscribe Modal',
  icon: 'i-tabler-mail',
  colorTheme: 'blue',
  isPublic: false,
  el: vue.defineAsyncComponent(async () => import('./ElCard.vue')),
  templates: [
    cardTemplate({ templateId: 'demoProse', el: vue.defineAsyncComponent(async () => import('./DemoProse.vue')) }),
  ],

  getConfig: async () => {
    const { getConfig } = await import('./config.js')
    return getConfig()
  },

  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})
