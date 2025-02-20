import type { Card } from '@fiction/site'
import type { FictionPosts } from '.'
import type { EmailConfig, TablePostConfig } from './schema'
import { FictionObject, objectId, vue } from '@fiction/core'
import { AutosaveUtility } from '@fiction/core/utils/save'
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
  visibility = vue.ref(this.settings.visibility || 'public')
  emailConfig = vue.ref(this.settings.emailConfig || ({ filters: [], target: 'all' } as EmailConfig))
  isFeatured = vue.ref(this.settings.isFeatured || false)
  priority = vue.ref(this.settings.priority || 0)

  hasChanges = vue.ref(this.settings.hasChanges || false)
  publishAt = vue.ref(this.settings.publishAt)
  wordCount = vue.ref(this.settings.wordCount || 0)
  scheduleMode = vue.ref<'now' | 'schedule'>('now')

  saveUtil = new AutosaveUtility({
    onSave: async () => this.save({ isAutosave: true, caller: 'autosave' }),
  })

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
            this.saveUtil.autosave({ caller: 'update' })
        }
      }

      this.settings = { ...this.settings, [key as keyof TablePostConfig]: value }
    })
  }

  async save(args: { isAutosave?: boolean, publishAt?: string, caller: string }) {
    const { isAutosave, caller = 'unknown caller' } = args
    const fields = this.toConfig()

    const params = { _action: 'update', where: { postId: this.postId }, fields, isAutosave } as const
    const p = await managePost({ fictionPosts: this.settings.fictionPosts, params, caller: 'savePost', disableNotify: isAutosave })

    this.update(p?.toConfig() || {}, { caller: `savePost-${caller}`, noSave: true })

    this.saveUtil.clear()
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

      emailConfig: this.emailConfig.value,
      visibility: this.visibility.value,
      isFeatured: this.isFeatured.value,
      priority: this.priority.value,
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
}
