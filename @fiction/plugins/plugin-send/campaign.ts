import { FictionObject, objectId, vue } from '@fiction/core'
import type { TablePostConfig } from '@fiction/posts'
import { Post } from '@fiction/posts'
import type { EmailCampaignConfig } from './schema'
import { settingsKeys } from './schema'
import type { FictionSend } from '.'

export type EmailConfig = { fictionSend: FictionSend } & EmailCampaignConfig

export class EmailCampaign extends FictionObject<EmailConfig> {
  fictionPosts = this.settings.fictionSend.settings.fictionPosts
  fictionUser = this.settings.fictionSend.settings.fictionUser
  campaignId = this.settings.campaignId || objectId({ prefix: 'eml' })
  status = vue.ref(this.settings.status || 'pending')
  scheduleMode = vue.ref(this.settings.scheduleMode || 'now')
  title = vue.ref(this.settings.title || 'Untitled')
  scheduledAt = vue.ref(this.settings.scheduledAt)
  filters = vue.ref(this.settings.filters || [])
  post = vue.shallowRef(new Post({ ...(this.settings.post || {}), fictionPosts: this.fictionPosts }))
  subject = vue.ref(this.settings.subject || '')
  preview = vue.ref(this.settings.preview || '')
  userConfig = vue.ref(this.settings.userConfig || {})
  constructor(settings: EmailConfig) {
    super('EmailSend', settings)
  }

  update(sendConfig: Partial<EmailCampaignConfig>, options: { noSave?: boolean } = {}) {
    const { noSave = false } = options

    if (!sendConfig)
      return
    const availableKeys = settingsKeys as string[]

    const entries = Object.entries(sendConfig).filter(([key]) => availableKeys.includes(key))
    entries.forEach(([key, value]) => {
      const k = this[key as keyof this]

      if (value !== undefined && vue.isRef(k)) {
        const ref = k as vue.Ref
        const existing = k.value
        if (existing !== value) {
          ref.value = value
        }
      }

      this.settings = { ...this.settings, [key as keyof TablePostConfig]: value }
    })

    if (sendConfig.post) {
      this.post.value.update(sendConfig.post, { noSave: true })
    }
  }

  async save() {
    const fields = this.toConfig()

    await this.settings.fictionSend.requests.ManageCampaign.projectRequest({ _action: 'update', fields, where: [{ campaignId: this.campaignId }] }, { minTime: 500 })
  }

  async delete() {
    this.log.info('Deleting Send')
    await this.settings.fictionSend.requests.ManageCampaign.projectRequest({ _action: 'delete', where: [{ campaignId: this.campaignId }] }, { minTime: 500 })
    this.settings.fictionSend.cacheKey.value++
  }

  toConfig(): EmailCampaignConfig {
    const { fictionSend, ...rest } = this.settings

    return {
      ...rest,
      post: this.post.value.toConfig(),
      status: this.status.value,
      scheduleMode: this.scheduleMode.value,
      scheduledAt: this.scheduledAt.value,
      subject: this.subject.value,
      preview: this.preview.value,
      title: this.title.value,
      filters: this.filters.value,
      userConfig: this.userConfig.value,
    }
  }
}
