import type { TablePostConfig } from '@fiction/posts'
import type { FictionSend } from '.'
import type { EmailCampaignConfig } from './schema'
import { FictionObject, objectId, vue } from '@fiction/core'
import { Post } from '@fiction/posts'
import { settingsKeys } from './schema'

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
  post = vue.shallowRef(new Post({ ...(this.settings.post || {}), fictionPosts: this.fictionPosts, sourceMode: 'standard' }))
  subject = vue.ref(this.settings.subject || '')
  preview = vue.ref(this.settings.preview || '')
  userConfig = vue.ref(this.settings.userConfig || {})
  isDirty = vue.ref(false)
  saveTimeout: ReturnType<typeof setTimeout> | null = null // Store timeout reference

  constructor(settings: EmailConfig) {
    super('EmailSend', settings)
  }

  update(sendConfig: Partial<EmailCampaignConfig>, options: { noSave?: boolean } = {}) {
    const { noSave = false } = options || {}
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

          if (!noSave)
            this.autosave()
        }
      }

      this.settings = { ...this.settings, [key as keyof TablePostConfig]: value }
    })

    if (sendConfig.post) {
      this.post.value.update(sendConfig.post, { noSave: true, caller: 'campaignUpdate' })
    }
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
      this.save({ disableNotify: true }).catch(console.error) // Error handling
    }, 2000) // Set a new timeout for 2 seconds
  }

  async save(args: { disableNotify?: boolean } = {}) {
    const fields = this.toConfig()
    this.clearAutosave()
    await this.settings.fictionSend.requests.ManageCampaign.projectRequest({ _action: 'update', fields, where: [{ campaignId: this.campaignId }] }, { minTime: 500, ...args })
    this.isDirty.value = false
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
