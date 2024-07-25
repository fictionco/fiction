import { FictionObject, objectId, vue } from '@fiction/core'
import type { TablePostConfig } from './schema'
import { managePost } from './utils'
import type { FictionPosts } from '.'

export type PostConfig = { fictionPosts: FictionPosts } & TablePostConfig

export class Post extends FictionObject<PostConfig> {
  postId = this.settings.postId || objectId({ prefix: 'pst' })
  status = vue.ref(this.settings.status || 'draft')
  title = vue.ref(this.settings.title || '')
  subTitle = vue.ref(this.settings.subTitle || '')
  excerpt = vue.ref(this.settings.excerpt || '')
  content = vue.ref(this.settings.content || '')
  slug = vue.ref(this.settings.slug || '')
  media = vue.ref(this.settings.media || {})
  tags = vue.ref(this.settings.taxonomy?.filter(_ => _.type === 'tag') || [])
  categories = vue.ref(this.settings.taxonomy?.filter(_ => _.type === 'category') || [])
  authors = vue.ref(this.settings.authors || [])
  sites = vue.ref(this.settings.sites || [])
  dateAt = vue.ref(this.settings.dateAt || new Date().toISOString())
  userConfig = vue.ref(this.settings.userConfig || {})
  isDirty = vue.ref(false)
  hasChanges = vue.ref(this.settings.hasChanges || false)
  publishAt = vue.ref(this.settings.publishAt)
  saveTimeout: ReturnType<typeof setTimeout> | null = null // Store timeout reference

  constructor(settings: PostConfig) {
    super('Post', settings)
  }

  update(postConfig: Partial<TablePostConfig>, options: { noSave?: boolean } = {}) {
    const { noSave = false } = options

    if (!postConfig)
      return
    const availableKeys = [
      'title',
      'subTitle',
      'content',
      'slug',
      'userConfig',
      'media',
      'excerpt',
      'dateAt',
      'publishAt',
      'hasChanges',
      'status',
      'tags',
      'categories',
      'authors',
      'sites',
    ]
    const entries = Object.entries(postConfig).filter(([key]) => availableKeys.includes(key))
    entries.forEach(([key, value]) => {
      const k = this[key as keyof this]

      if (value !== undefined && vue.isRef(k)) {
        const ref = k as vue.Ref
        const existing = k.value
        if (existing !== value) {
          ref.value = value

          if (!noSave)
            this.autosave()
        }
      }

      this.settings = { ...this.settings, [key as keyof TablePostConfig]: value }
    })
  }

  clearAutosave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout) // Clear the timeout after saving
      this.saveTimeout = null
    }
  }

  autosave() {
    this.isDirty.value = true
    this.clearAutosave()

    this.saveTimeout = setTimeout(() => {
      this.save({ mode: 'draft' }).catch(console.error) // Error handling
    }, 2000) // Set a new timeout for 10 seconds
  }

  async save(args: { mode: 'publish' | 'draft' | 'schedule', publishAt?: string }) {
    const { mode = 'draft' } = args
    this.log.info(`Saving post: ${mode}`)
    const _action = mode === 'publish' ? 'update' : 'saveDraft'

    const fields = mode === 'publish'
      ? { ...this.toConfig() } as const
      : mode === 'schedule'
        ? { ...this.toConfig(), status: 'scheduled', publishAt: args.publishAt } as const
        : this.toConfig()

    const params = { _action, postId: this.postId, fields } as const
    const p = await managePost({ fictionPosts: this.settings.fictionPosts, params })

    if (mode !== 'draft')
      this.update(p?.toConfig() || {})

    this.isDirty.value = false
    this.clearAutosave()
  }

  async delete() {
    this.log.info('Deleting post')
    await managePost({ fictionPosts: this.settings.fictionPosts, params: { _action: 'delete', postId: this.postId } })
    this.settings.fictionPosts.cacheKey.value++
  }

  toConfig(): TablePostConfig {
    const { fictionPosts, ...rest } = this.settings

    return {
      ...rest,
      slug: this.slug.value,
      postId: this.postId,
      title: this.title.value,
      subTitle: this.subTitle.value,
      excerpt: this.excerpt.value,
      content: this.content.value,
      userConfig: this.userConfig.value,
      media: this.media.value,
      dateAt: this.dateAt.value,
      hasChanges: this.hasChanges.value,
      publishAt: this.publishAt.value,
      status: this.status.value,
      taxonomy: [...this.tags.value, ...this.categories.value],
      tags: this.tags.value,
      categories: this.categories.value,
      authors: this.authors.value,
      sites: this.sites.value,
    }
  }
}
