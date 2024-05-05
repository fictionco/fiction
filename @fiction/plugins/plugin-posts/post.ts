import { FictionObject, objectId, vue } from '@fiction/core'
import type { TablePostConfig } from './schema'
import { managePost } from './utils'
import type { FictionPosts } from '.'

export type PostConfig = { fictionPosts: FictionPosts } & TablePostConfig

export class Post extends FictionObject<PostConfig> {
  postId = this.settings.postId || objectId({ prefix: 'pst' })
  title = vue.ref(this.settings.title || '')
  subTitle = vue.ref(this.settings.subTitle || '')
  excerpt = vue.ref(this.settings.excerpt || '')
  content = vue.ref(this.settings.content || '')
  slug = vue.ref(this.settings.slug || '')
  image = vue.ref(this.settings.image || {})
  dateAt = vue.ref(this.settings.dateAt || new Date().toISOString())
  userConfig = vue.ref(this.settings.userConfig || {})
  isDirty = vue.ref(false)
  saveTimeout: ReturnType<typeof setTimeout> | null = null // Store timeout reference

  constructor(settings: PostConfig) {
    super('Post', settings)
  }

  update(postConfig: Partial<TablePostConfig>) {
    if (!postConfig)
      return
    const availableKeys = ['title', 'subTitle', 'content', 'slug', 'userConfig', 'image', 'excerpt', 'dateAt']
    const entries = Object.entries(postConfig).filter(([key]) => availableKeys.includes(key))
    entries.forEach(([key, value]) => {
      const k = this[key as keyof this]

      if (value !== undefined && vue.isRef(k)) {
        const ref = k as vue.Ref
        const existing = k.value
        if (existing !== value) {
          ref.value = value
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
      this.save('draft').catch(console.error) // Error handling
    }, 2000) // Set a new timeout for 10 seconds
  }

  async save(mode: 'publish' | 'draft' = 'draft') {
    this.log.info(`Saving post: ${mode}`)
    const _action = mode === 'publish' ? 'update' : 'saveDraft'
    const params = { _action, postId: this.postId, fields: this.toConfig() } as const
    await managePost({ fictionPosts: this.settings.fictionPosts, params })
    this.isDirty.value = false
    this.clearAutosave()
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
      image: this.image.value,
      dateAt: this.dateAt.value,
    }
  }
}
