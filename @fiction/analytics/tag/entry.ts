import { log } from '@fiction/core/plugin-log'
import { shouldTrack } from '../utils/tracking.js'
import type { TagEntryPoint, TagSettings } from './types.js'

export async function initializeClient(tagSettings: TagSettings): Promise<void> {
  try {
    if (!shouldTrack())
      return

    if (!tagSettings) {
      log.error('initialize', 'Fiction analytics tag settings not found', { data: { tagSettings } })
      return
    }

    const p = []

    const onlyTags = tagSettings.onlyTags || []
    const tags = !onlyTags || onlyTags.length === 0 ? ['analytics', 'events', 'replays'] : onlyTags

    log.info('clientTag', `loading tags: ${tags.join(', ')}`)

    if (tags.includes('analytics'))
      p.push(import('./tagAnalytics.js'))

    const entryFiles = (await Promise.all(p)) as { setup: TagEntryPoint<TagSettings> }[]

    const tagService = await Promise.all(entryFiles.map(_ => _.setup(tagSettings)))

    tagService.forEach((t) => { t.initialized = t.init() })
  }
  catch (error) {
    log.error('init', 'error', { error })
  }
}
