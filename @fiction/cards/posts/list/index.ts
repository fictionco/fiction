import { safeDirname, vue } from '@fiction/core'
import { cardTemplate } from '@fiction/site/card.js'

export const templateId = 'cardPostsListV1'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  tags: ['blog'],
  frequency: 'standard',
  title: 'List Posts',
  subTitle: 'A versatile posts display card with grid and scroll layouts',
  description: 'Display your blog posts and articles in a clean, organized list format. Choose from grid or scroll layouts to showcase your content effectively, with customizable display options for titles, excerpts, dates, and featured images.',
  icon: 'i-tabler-article',
  colorTheme: 'rose',
  el: vue.defineAsyncComponent(() => import('./ElCard.vue')),
  isPublic: true,
  getBaseConfig: () => {
    return { standard: { showOnSingle: true } }
  },
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig(args)
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})
