import { FictionObject, objectId, vue } from '@fiction/core'
import type { TablePostConfig } from './schema'

export class Post extends FictionObject<TablePostConfig> {
  postId = this.settings.postId || objectId({ prefix: 'pst' })
  title = vue.ref(this.settings.title || '')
  content = vue.ref(this.settings.content || '')
  userConfig = vue.ref(this.settings.userConfig || {})

  constructor(settings: TablePostConfig) {
    super('Post', settings)
  }

  update(postConfig: TablePostConfig) {
    if (!postConfig)
      return
    const availableKeys = ['title', 'slug', 'userConfig']
    const entries = Object.entries(postConfig).filter(([key]) => availableKeys.includes(key))
    entries.forEach(([key, value]) => {
      if (value !== undefined && vue.isRef(this[key as keyof this]))
        (this[key as keyof this] as vue.Ref).value = value

      this.settings = { ...this.settings, [key as keyof TablePostConfig]: value }
    })
  }

  toConfig(): TablePostConfig {
    return {
      ...this.settings,
      postId: this.postId,
      title: this.title.value,
      content: this.content.value,
      userConfig: this.userConfig.value,
    }
  }
}
