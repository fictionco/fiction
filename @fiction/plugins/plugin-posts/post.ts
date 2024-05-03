import { FictionObject, objectId, vue } from '@fiction/core'
import type { TablePostConfig } from './schema'

export class Post extends FictionObject<TablePostConfig> {
  postId = this.settings.postId || objectId({ prefix: 'pst' })
  title = vue.ref(this.settings.title || '')
  content = vue.ref(this.settings.content || '')

  constructor(settings: TablePostConfig) {
    super('Post', settings)
  }

  toConfig(): TablePostConfig {
    return {
      ...this.settings,
      postId: this.postId,
      title: this.title.value,
      content: this.content.value,
    }
  }
}
