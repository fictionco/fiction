import { safeDirname, vue } from '@fiction/core'
import { getPostPaths } from '@fiction/posts/utils/post'
import { cardTemplate } from '@fiction/site/card.js'

export const templateId = 'cardBlogV1'

export const template = cardTemplate({
  root: safeDirname(import.meta.url),
  templateId,
  category: ['posts'],
  icon: 'i-tabler-notebook',
  title: 'Blog',
  subTitle: 'Standard blog layout',
  description: 'Transform your blog into a visually stunning magazine with customizable layouts, featured posts, and rich media integration. Perfect for showcasing editorial content, news articles, and thought leadership pieces with style.',
  colorTheme: 'blue',
  el: vue.defineAsyncComponent(() => import('./ElMagazine.vue')),
  isPublic: true,
  getConfig: async (args) => {
    const { getConfig } = await import('./config')
    return getConfig({ ...args, templateId })
  },
  getContentPaths: async ({ site, card }) => {
    const posts = card.userConfig.value.posts
    if (!posts)
      return []
    return getPostPaths({ site, card, posts })
  },
  screenshot: {
    light: new URL('img/screen-light.svg', import.meta.url).href,
    dark: new URL('img/screen-dark.svg', import.meta.url).href,
  },
})

export type { UserConfig } from './config'
