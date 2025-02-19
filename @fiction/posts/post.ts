import type { Card } from '@fiction/site'
import type { FictionPosts } from '.'
import type { EmailConfig, TablePostConfig } from './schema'
import { FictionObject, objectId, vue } from '@fiction/core'
import { postLink } from '.'
import { managePost } from './utils'

export type PostConfig = {
  fictionPosts: FictionPosts
  card?: Card
  sourceMode: 'local' | 'standard'
  noAutoSave?: boolean
  localSourcePath?: string
  viewSlug?: string
} & TablePostConfig

export class Post extends FictionObject<PostConfig> {
  card = this.settings.card
  postId = this.settings.postId || objectId({ prefix: 'pst' })
  status = vue.ref(this.settings.status || 'draft')
  title = vue.ref(this.settings.title || '')
  subTitle = vue.ref(this.settings.subTitle || '')
  excerpt = vue.ref(this.settings.excerpt || '')
  content = vue.ref(this.settings.content || '')
  slug = vue.ref(this.settings.slug || '')
  href = vue.computed(() => postLink({ card: this.settings.card, slug: this.slug.value, viewSlug: this.settings.viewSlug }))
  media = vue.ref(this.settings.media || {})
  tags = vue.ref(this.settings.tags || [])
  categories = vue.ref(this.settings.categories || [])
  authors = vue.ref(this.settings.authors || [])
  sites = vue.shallowRef(this.settings.sites || [])
  dateAt = vue.ref(this.settings.dateAt || new Date().toISOString())
  userConfig = vue.ref(this.settings.userConfig || {})
  emailConfig = vue.ref(this.settings.emailConfig || ({ audience: { mode: 'all', filters: [] } } as EmailConfig))
  emailStatus = vue.ref(this.settings.emailStatus || 'toSend')
  isDirty = vue.ref(false)
  hasChanges = vue.ref(this.settings.hasChanges || false)
  publishAt = vue.ref(this.settings.publishAt)
  wordCount = vue.ref(this.settings.wordCount || 0)
  scheduleMode = vue.ref<'now' | 'schedule'>('now')
  saveTimeout: ReturnType<typeof setTimeout> | null = null // Store timeout reference

  constructor(settings: PostConfig) {
    super('Post', settings)
  }

  update(postConfig: Partial<TablePostConfig>, options: { noSave?: boolean, caller: string }) {
    const { noSave = false } = options || {}

    if (!postConfig)
      return
    const availableKeys = [
      'title',
      'subTitle',
      'content',
      'slug',
      'userConfig',
      'emailStatus',
      'emailConfig',
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
    if (this.settings.sourceMode === 'local' || this.settings.noAutoSave) {
      return
    }

    this.isDirty.value = true
    this.clearAutosave()

    this.saveTimeout = setTimeout(() => {
      this.save({ mode: 'draft', caller: 'autosave' }).catch(console.error) // Error handling
    }, 2000) // Set a new timeout for 2 seconds
  }

  async save(args: { mode: 'publish' | 'draft', publishAt?: string, caller: string }) {
    const { mode = 'draft', caller = 'unknown caller' } = args
    this.log.info(`Saving post: ${mode}`)
    const _action = mode === 'draft' ? 'saveDraft' : 'update'
    this.hasChanges.value = mode === 'draft'

    const fields = this.toConfig()

    this.clearAutosave()
    const params = { _action, where: { postId: this.postId }, fields } as const
    const p = await managePost({ fictionPosts: this.settings.fictionPosts, params, caller: 'savePost' })

    if (mode !== 'draft')
      this.update(p?.toConfig() || {}, { caller: 'savePost', noSave: true })

    this.isDirty.value = false
  }

  async delete() {
    this.log.info('Deleting post')
    await managePost({ fictionPosts: this.settings.fictionPosts, params: { _action: 'delete', where: { postId: this.postId } }, caller: 'deletePost' })
    this.settings.fictionPosts.cacheKey.value++
  }

  toConfig(): TablePostConfig {
    const { fictionPosts, card, ...rest } = this.settings

    return {
      ...rest,
      slug: this.slug.value,
      postId: this.postId,
      title: this.title.value,
      subTitle: this.subTitle.value,
      excerpt: this.excerpt.value,
      content: this.content.value,
      userConfig: this.userConfig.value,
      emailStatus: this.emailStatus.value,
      emailConfig: this.emailConfig.value,
      media: this.media.value,
      dateAt: this.dateAt.value,
      hasChanges: this.hasChanges.value,
      publishAt: this.publishAt.value,
      status: this.status.value,
      tags: this.tags.value,
      categories: this.categories.value,
      authors: this.authors.value,
      sites: this.sites.value,
      wordCount: this.wordCount.value,
    }
  }

  async resetToPublished() {
    const postId = this.postId

    const r = await this.settings.fictionPosts.requests.ManagePost.projectRequest({
      _action: 'revertDraft',
      where: { postId },
    }, { caller: 'postEdit' })

    if (r.status === 'success') {
      const responsePost = r.data?.[0]

      await this.update({ ...responsePost }, { noSave: true, caller: 'resetToPublished' })
    }
  }
}
