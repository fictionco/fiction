import { vue } from '@fiction/core/utils/libraries'
import { shortId } from '@fiction/core'
import { emitEvent } from '@fiction/core/utils/event'
import { ClientTag } from '@fiction/analytics/tag/clientTag.js'
import type { TagEntryPoint, TagSettings } from '@fiction/analytics/tag/types.js'
import EmbedWrap from './EmbedWrap.vue'

type FormsTagSettings = {} & TagSettings

export class FormsTag extends ClientTag<FormsTagSettings> {
  constructor(tagSettings: FormsTagSettings) {
    super('forms', { gen: 'core', ...tagSettings })
  }

  async init(): Promise<void> {
    const els = document.querySelectorAll('[data-fiction-embed]')

    els.forEach((el) => {
      const elem = el as HTMLElement

      const u = new URL(elem.dataset.fictionEmbed as string)

      const mode = u.searchParams.get('mode') || 'inline'
      const trigger = u.searchParams.get('trigger') || 'click'

      // create element and append to body
      const embeddedEl = document.createElement('div')
      const embedId = `fiction-embed-${shortId()}`
      const embedUrl = u.toString()
      const props = { embedUrl, embedId }
      embeddedEl.id = embedId

      if (mode === 'inline') {
        el.replaceWith(embeddedEl)
      }
      else {
        document.body.append(embeddedEl)

        /**
         * If trigger is click, leave original element in place and activate on click
         */
        if (trigger === 'click') {
          el.addEventListener('click', (e) => {
            e.preventDefault()
            setTimeout(() => {
              emitEvent('triggerEmbed', props)
            }, 10)
          })
        }
        else {
          el.remove()
        }
      }

      const app = vue.createApp(EmbedWrap, props)
      app.mount(embeddedEl)
    })
  }
}

export const setup: TagEntryPoint<FormsTagSettings> = async (tagSettings) => {
  return new FormsTag(tagSettings)
}
