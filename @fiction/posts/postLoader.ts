import type { IndexMeta, IndexQuery } from '@fiction/core'
import type { PostHandlingObject } from '@fiction/posts'
import type { Card } from '@fiction/site'
import type { FictionPosts } from './index.js'
import type { TablePostConfig } from './schema.js'
import { FictionObject, vue } from '@fiction/core'
import { Post } from './post.js'

type PostLoaderSettings = {
  fictionPosts: FictionPosts
  card: Card
  rootKey?: string
}

export class PostLoader extends FictionObject<PostLoaderSettings> {
  card = this.settings.card
  rootKey = this.settings.rootKey || 'posts'
  private config = vue.computed(() => this.settings.card.userConfig.value[this.rootKey] as PostHandlingObject | undefined)
  private sourceMode = vue.computed(() => this.config.value?.format === 'local' ? 'local' : 'standard')
  loading = vue.ref(false)

  constructor(settings: PostLoaderSettings) {
    super('PostLoader', settings)
  }

  private getDefaultIndexMeta(): IndexMeta {
    return { offset: 0, limit: 10, count: 0, order: 'desc', orderBy: 'dateAt' }
  }

  private createPost(postData: TablePostConfig, index: number): Post {
    return new Post({
      fictionPosts: this.settings.fictionPosts,
      card: this.settings.card,
      localSourcePath: `${this.rootKey}.entries.${index}`,
      ...postData,
    })
  }

  public async loadPosts(args: IndexQuery = {}) {
    const { entries, indexMeta } = (await this.fetchPostData(args)) || {}
    const posts = entries?.map((entry, index) => this.createPost(entry, index)) || []

    return { posts, indexMeta }
  }

  async fetchPostData(args: IndexQuery = {}) {
    if (this.sourceMode.value === 'local') {
      return await this.fetchLocalPosts(args)
    }
    else {
      return await this.fetchGlobalPosts(args)
    }
  }

  private async fetchLocalPosts(args: IndexQuery = {}) {
    const allEntries = this.config.value?.entries || []
    const { offset = 0, limit = 12 } = { ...this.config.value, ...args }
    const entries = allEntries.slice(offset, offset + limit)
    const indexMeta = { ...this.getDefaultIndexMeta(), count: entries.length }

    return { entries, indexMeta }
  }

  private async fetchGlobalPosts(args: IndexQuery = {}) {
    const orgId = this.card.site?.settings.orgId
    if (!orgId) {
      throw new Error('No fiction orgId found')
    }

    const { offset = 0, limit = 12 } = { ...this.config.value, ...args }

    const result = await this.settings.fictionPosts.requests.ManagePost.request({
      _action: 'list',
      where: { orgId },
      limit,
      offset,
    })

    const entries = result.data || []
    const indexMeta = { ...this.getDefaultIndexMeta(), ...result.indexMeta }

    return { entries, indexMeta }
  }

  public async loadSinglePost(slug: string) {
    const { singleEntry, index = -1 } = await this.fetchSingleData(slug)
    if (!singleEntry) {
      throw new Error('Post not found')
    }

    return this.createPost(singleEntry, index)
  }

  private async fetchSingleData(slug: string) {
    const conf = this.config.value
    let singleEntry: TablePostConfig | undefined
    let index: number | undefined
    if (this.sourceMode.value === 'local') {
      const index = conf?.entries?.findIndex(p => p.slug === slug)
      if (index && index !== -1) {
        singleEntry = conf?.entries?.[index]
      }
    }
    else {
      const orgId = this.settings.card.site?.settings.orgId
      if (!orgId)
        throw new Error('No fiction orgId found')

      const result = await this.settings.fictionPosts.requests.ManagePost.request({
        _action: 'get',
        where: { slug, orgId },
      })
      singleEntry = result.data?.[0]
    }

    return { singleEntry, index }
  }
}
