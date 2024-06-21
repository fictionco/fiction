import { FictionObject, objectId, vue } from '@fiction/core'
import type { FictionPosts, TablePostConfig } from '@fiction/posts'
import { Post } from '@fiction/posts'
import type { EmailSendConfig } from './schema'
import type { FictionSend } from '.'

export type PostConfig = { fictionSend: FictionSend, fictionPosts: FictionPosts } & EmailSendConfig

export class Email extends FictionObject<PostConfig> {
  emailId = this.settings.emailId || objectId({ prefix: 'eml' })
  status = vue.ref(this.settings.status || 'draft')
  title = vue.ref(this.settings.title || 'Untitled')
  scheduledAt = vue.ref(this.settings.scheduledAt)
  post = vue.shallowRef(new Post({ ...(this.settings.post || {}), fictionPosts: this.settings.fictionPosts }))
  constructor(settings: PostConfig) {
    super('EmailSend', settings)
  }

  update(sendConfig: Partial<EmailSendConfig>, options: { noSave?: boolean } = {}) {
    const { noSave = false } = options

    if (!sendConfig)
      return
    const availableKeys = [
      'scheduledAt',
      'status',
    ]
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
  }

  async save() {
    const fields = this.toConfig()

    await this.settings.fictionSend.requests.ManageSend.projectRequest({ _action: 'update', fields, where: [{ emailId: this.emailId }] })
  }

  async delete() {
    this.log.info('Deleting Send')
    await this.settings.fictionSend.requests.ManageSend.projectRequest({ _action: 'delete', where: [{ emailId: this.emailId }] })
    this.settings.fictionSend.cacheKey.value++
  }

  toConfig(): EmailSendConfig {
    const { fictionSend, fictionPosts, ...rest } = this.settings

    return {
      ...rest,
      post: this.post.value.toConfig(),
      status: this.status.value,
      scheduledAt: this.scheduledAt.value,
      title: this.title.value,
    }
  }
}
