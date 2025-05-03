import type { Card } from '@fiction/site'
import type { FictionPosts } from '.'
import type { TablePostConfig } from './schema'
import { FictionObject, objectId, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save'
import { PostLike } from './utils/like'

export type PostConfig = {
  fictionPosts?: FictionPosts
  card?: Card
  noAutoSave?: boolean
  localSourcePath?: string
  viewSlug?: string
} & TablePostConfig

export class Post extends FictionObject<PostConfig> {
  card = this.settings.card
  postId = this.settings.postId || objectId({ prefix: 'pst' })
  status = vue.ref(this.settings.status || 'draft')
  emailStatus = vue.ref(this.settings.emailStatus || 'draft')
  title = vue.ref(this.settings.title || '')
  subTitle = vue.ref(this.settings.subTitle || '')
  content = vue.ref(this.settings.content || '')
  slug = vue.ref(this.settings.slug || '')
  href = vue.computed(() => `/p/${this.slug.value}`)
  media = vue.ref(this.settings.media)
  theme = vue.ref(this.settings.theme || 'primary')
  audience = vue.ref(this.settings.audience || 'all')
  subject = vue.ref(this.settings.subject || '')
  preview = vue.ref(this.settings.preview || '')
  testEmails = vue.ref(this.settings.testEmails || [])
  tags = vue.ref(this.settings.tags || [])
  categories = vue.ref(this.settings.categories || [])
  authors = vue.ref(this.settings.authors || [])
  dateAt = vue.ref(this.settings.dateAt || new Date().toISOString())
  userConfig = vue.ref(this.settings.userConfig || {})
  visibility = vue.ref(this.settings.visibility || 'public')
  emailConfig = vue.ref(this.settings.emailConfig)
  isFeatured = vue.ref(this.settings.isFeatured || false)
  likeCount = vue.ref(this.settings.likeCount || 0)
  commentCount = vue.ref(this.settings.commentCount || 0)
  priority = vue.ref(this.settings.priority || 0)

  hasChanges = vue.ref(this.settings.hasChanges || false)
  publishAt = vue.ref(this.settings.publishAt)
  updatedAt = vue.ref(this.settings.updatedAt)
  publishMode = vue.ref(this.settings.publishMode || 'now')
  wordCount = vue.ref(this.settings.wordCount || 0)
  scheduleMode = vue.ref<'now' | 'schedule'>('now')
  editedFields = vue.ref<Record<string, boolean>>({})
  relatedPosts = vue.computed(() => {
    const { next, prev, similar } = this.settings.relatedPosts || {}
    const out = {
      next: next ? new Post({ ...this.settings, ...next }) : null,
      prev: prev ? new Post({ ...this.settings, ...prev }) : null,
      similar: similar ? similar.map(post => new Post({ ...this.settings, ...post })) : [],
    } as { next?: Post, prev?: Post, similar?: Post[] }

    return out
  })

  saveUtil = new AutosaveUtility({
    onSave: async () => this.save({ isAutosave: true, caller: 'autosave' }),
  })

  previewPath = vue.computed(() => this.card?.link({ path: `/preview-post/${this.postId}` }))

  like = new PostLike(this)

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
      'emailConfig',
      'isFeatured',
      'priority',
      'visibility',
      'media',
      'theme',
      'excerpt',
      'dateAt',
      'publishAt',
      'updatedAt',
      'publishMode',
      'hasChanges',
      'status',
      'emailStatus',
      'tags',
      'categories',
      'authors',
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
            this.saveUtil.autosave({ caller: 'update' })
        }
      }

      this.settings = { ...this.settings, [key as keyof TablePostConfig]: value }
    })

    this.hasChanges.value = true
  }

  async save(args: { isAutosave?: boolean, caller: string }) {
    const { isAutosave, caller = 'unknown caller' } = args

    if (!this.settings.fictionPosts) {
      throw new Error('No fictionPosts instance found')
    }

    this.saveUtil.clear()

    const fields = this.toConfig()

    const params = { _action: 'update', where: { postId: this.postId }, fields, isAutosave } as const
    const r = await this.settings.fictionPosts.requests.ManagePost.projectRequest(params, { caller, disableNotify: isAutosave })

    // don't update if autosave was called again during saving to prevent missing changes
    if (!isAutosave || !this.saveUtil.isDirty.value)
      this.update(r.data?.[0] || {}, { caller: `savePost-${caller}`, noSave: true })
  }

  async delete() {
    if (!this.settings.fictionPosts) {
      throw new Error('No fictionPosts instance found')
    }
    else {
      this.log.info('Deleting post')
    }
    await this.settings.fictionPosts.requests.ManagePost.projectRequest({ _action: 'delete', where: { postId: this.postId } }, { caller: 'deletePost' })

    this.settings.fictionPosts.cacheKey.value++
  }

  toConfig(): TablePostConfig {
    const { fictionPosts, card, ...rest } = this.settings

    return {
      ...rest,
      status: this.status.value,
      emailStatus: this.emailStatus.value,

      slug: this.slug.value,
      postId: this.postId,
      title: this.title.value,
      subTitle: this.subTitle.value,
      content: this.content.value,
      media: this.media.value,
      tags: this.tags.value,
      categories: this.categories.value,
      authors: this.authors.value,

      subject: this.subject.value,
      preview: this.preview.value,
      audience: this.audience.value,
      testEmails: this.testEmails.value,

      visibility: this.visibility.value,
      isFeatured: this.isFeatured.value,
      priority: this.priority.value,

      theme: this.theme.value,

      dateAt: this.dateAt.value,
      publishAt: this.publishAt.value,
      publishMode: this.publishMode.value,

      userConfig: this.userConfig.value,
      emailConfig: this.emailConfig.value,

      hasChanges: this.hasChanges.value,
    }
  }

  config = vue.computed({
    get: () => this.toConfig(),
    set: (value: TablePostConfig) => this.update(value, { noSave: false, caller: 'config' }),
  })

  copyLinkToClipboard() {
    // Get the current URL for sharing
    const url = typeof window !== 'undefined'
      ? window.location.origin + this.href.value
      : this.href.value

    this.log.info('Link copied to clipboard:', { data: { url } })

    // Copy to clipboard
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(url)

      this.settings.fictionPosts?.fictionEnv.events.emit('notify', {
        type: 'success',
        message: 'Link copied to clipboard',
        duration: 2000,
      })
    }
    else {
      this.settings.fictionPosts?.fictionEnv.events.emit('notify', {
        type: 'error',
        message: 'Failed to copy link to clipboard',
        duration: 2000,
      })
    }
  }
}
