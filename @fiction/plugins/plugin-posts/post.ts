import { FictionObject, objectId, vue } from '@fiction/core'
import type { TablePostConfig } from './schema'
import { managePost } from './utils'
import type { FictionPosts } from '.'

export type PostConfig = { fictionPosts: FictionPosts } & TablePostConfig

export class Post extends FictionObject<PostConfig> {
  postId = this.settings.postId || objectId({ prefix: 'pst' })
  title = vue.ref(this.settings.title || '')
  content = vue.ref(this.settings.content || '')
  userConfig = vue.ref(this.settings.userConfig || {})
  isDirty = vue.ref(false)
  saveTimeout: ReturnType<typeof setTimeout> | null = null // Store timeout reference

  constructor(settings: PostConfig) {
    super('Post', settings)
  }

  update(postConfig: TablePostConfig) {
    if (!postConfig)
      return
    const availableKeys = ['title', 'subTitle', 'slug', 'userConfig']
    const entries = Object.entries(postConfig).filter(([key]) => availableKeys.includes(key))
    entries.forEach(([key, value]) => {
      if (value !== undefined && vue.isRef(this[key as keyof this]))
        (this[key as keyof this] as vue.Ref).value = value

      this.settings = { ...this.settings, [key as keyof TablePostConfig]: value }
    })

    this.isDirty.value = true
    this.autosave()
  }

  clearAutosave() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout) // Clear the timeout after saving
      this.saveTimeout = null
    }
  }

  autosave() {
    this.clearAutosave()

    this.saveTimeout = setTimeout(() => {
      this.save().catch(console.error) // Error handling
    }, 10000) // Set a new timeout for 10 seconds
  }

  async save(mode: 'publish' | 'draft' = 'draft') {
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
      postId: this.postId,
      title: this.title.value,
      content: this.content.value,
      userConfig: this.userConfig.value,
    }
  }
}
