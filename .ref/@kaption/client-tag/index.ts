import { log } from '@factor/api/plugin-log'
import type { TagEntryPoint, TagSettings } from '@kaption/core/plugin-tag'
import { shouldTrack } from './utils'

export async function initialize(tagSettings: TagSettings): Promise<void> {
  try {
    if (!shouldTrack())
      return

    if (!tagSettings) {
      log.error('initialize', 'Kaption tag settings not found', {
        data: { tagSettings },
      })
      return
    }

    const p = []

    const onlyTags = tagSettings.onlyTags || []
    const tags
      = !onlyTags || onlyTags.length === 0
        ? ['analytics', 'events', 'replays']
        : onlyTags

    log.info('clientTag', `loading tags: ${tags.join(', ')}`)

    if (tags.includes('analytics'))
      p.push(import('@kaption/core/plugin-analytics/tag'))

    if (tags.includes('events'))
      p.push(import('@kaption/core/plugin-events/tag'))

    if (tags.includes('replays'))
      p.push(import('@kaption/core/plugin-replays/tag'))

    p.push(import('@kaption/core/plugin-embed/tag'))

    const entryFiles = (await Promise.all(p)) as {
      setup: TagEntryPoint<TagSettings>
    }[]

    const tagService = await Promise.all(
      entryFiles.map(_ => _.setup(tagSettings)),
    )

    tagService.forEach((t) => {
      t.initialized = t.init()
    })
  }
  catch (error) {
    log.error('init', 'error', { error })
  }
}
