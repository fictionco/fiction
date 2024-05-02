import { FictionObject, objectId } from '@fiction/core'
import type { TablePostConfig } from './schema'

export class Post extends FictionObject<TablePostConfig> {
  postId = this.settings.postId || objectId({ prefix: 'pst' })

  constructor(settings: TablePostConfig) {
    super('Post', settings)
  }

  toConfig(): TablePostConfig {
    return {
      ...this.settings,
    }
  }
}
