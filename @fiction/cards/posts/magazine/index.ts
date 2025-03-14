import { safeDirname, vue } from '@fiction/core'
import { getPostPaths } from '@fiction/posts/utils/post'
import { cardTemplate } from '@fiction/site'

export const templateId = 'cardPostsMagazineV1'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  category: ['posts'],
  icon: 'i-tabler-notebook',
  title: 'Magazine Posts',
  subTitle: 'Create dynamic blog layouts with featured posts and immersive content',
  description: 'Transform your blog into a visually stunning magazine with customizable layouts, featured posts, and rich media integration. Perfect for showcasing editorial content, news articles, and thought leadership pieces with style.',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./ElMagazine.vue')),
  isPublic: true,
  getBaseConfig: () => {
    return { standard: { showOnSingle: true } }
  },
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  getContentPaths: async ({ site, card, viewPath }) => {
    const posts = card.userConfig.value.posts
    if (!posts)
      return []
    return getPostPaths({ site, card, viewPath, posts })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { UserConfig } from './config'
