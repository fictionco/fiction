import type { TagSettings } from '@factor/api/tag/types'
import { log } from '@factor/api/plugin-log'
import type { ClientTag } from '@factor/api/tag/clientTag'

declare global {
  interface Window {
    plTag: Record<string, ClientTag>
  }
}

export async function initialize(tagSettings: TagSettings): Promise<void> {
  const namespace = 'PLTag'
  try {
    if (!tagSettings) {
      log.error(namespace, 'tag settings not found', { data: { tagSettings } })
      return
    }

    const p = []

    window.plTag = {}

    p.push(import('@pagelines/core/plugin-embed/tag'))

    const entryFiles = await Promise.all(p)

    const tagService = await Promise.all(
      entryFiles.map(_ => _.setup(tagSettings)),
    )

    tagService.forEach((t) => {
      t.initialized = t.init()
      window.plTag[t.tagId] = t

      log.info(namespace, `initialized ${t.tagId} at ${location.href}`)
    })
  }
  catch (error) {
    log.error('init', 'error', { error })
  }
}
