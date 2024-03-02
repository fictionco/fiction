import type { FactorApp, FactorPluginSettings } from '@factor/api'
import { FactorPlugin } from '@factor/api'

import type { GhostAPI } from '@tryghost/content-api'
import GhostContentAPI from '@tryghost/content-api'
import type * as types from './types'

export * from './types'
export type {
  PostsOrPages,
  PostOrPage,
  Pagination,
} from '@tryghost/content-api'

export type BlogOptions = {
  baseRoute: string
  factorApp?: FactorApp
  ghostContentKey: string
  ghostUrl: string
  ghostPostFilter: string
} & FactorPluginSettings

export class FactorBlog extends FactorPlugin<BlogOptions> {
  factorApp?: FactorApp
  ghostContentKey = this.settings.ghostContentKey
  ghostUrl = this.settings.ghostUrl
  ghostApi?: GhostAPI
  ghostPostFilter = this.settings.ghostPostFilter || ''
  baseRoute = this.settings.baseRoute
  constructor(settings: BlogOptions) {
    super('blog', settings)

    this.factorApp = settings.factorApp

    if (this.factorApp && this.ghostContentKey) {
      this.factorApp.addSitemap(async () => {
        const ps = await this.getGhostPosts()
        const paths = ps?.map(p => `${this.baseRoute}/${p.slug || ''}`) ?? []
        return { topic: 'posts', paths }
      })
    }

    if (this.ghostContentKey) {
      try {
        this.ghostApi = new GhostContentAPI({
          url: this.ghostUrl,
          key: this.ghostContentKey,
          version: 'v5.0',
        })
      }
      catch (error) {
        this.log.error('ghost error', { error })
      }
    }
  }

  readingMinutes = (content?: string): number => {
    if (!content)
      return 0

    const wpm = 225
    const words = content.trim().split(/\s+/).length
    const time = Math.ceil(words / wpm)
    return time
  }

  async getGhostPosts(args?: { limit: number }) {
    const { limit = 20 } = args || {}
    try {
      const result = await this.ghostApi?.posts.browse({
        limit,
        filter: this.ghostPostFilter,
        include: ['authors', 'tags'],
      })

      return result
    }
    catch (error) {
      this.log.error('ghost error', { error })
    }
  }

  async getGhostPost(slug?: string) {
    if (!slug)
      return
    try {
      const result = await this.ghostApi?.posts.read(
        { slug },

        { include: ['authors', 'tags'] },
      )

      return result
    }
    catch (error) {
      this.log.error('ghost error', { error })
    }
  }

  /**
   * Gets all the routes for docs
   */
  scanRoutes = (posts: types.BlogPost<string>[]): string[] => {
    const routes: string[] = []
    const baseRoute = this.settings.baseRoute ?? '/blog'

    const pathBase = baseRoute === '/' ? '' : baseRoute

    posts.forEach((c) => {
      if (
        !c.status
        || c.status === 'published'
        || process.env.NODE_ENV === 'development'
      ) {
        const permalink = c.permalink || this.utils.camelToKebab(c.key)
        routes.push(`${pathBase}/${permalink}`)
      }
    })

    return routes
  }
}
