import { vue } from '@factor/api/utils/libraries'
import { shortId } from '@factor/api/utils/utils'
import { emitEvent } from '@factor/api/utils/event'
import { ClientTag } from '../tag-utils/client'
import type { TagEntryPoint, TagSettings } from '../plugin-tag/types'
import EmbedWrap from './EmbedWrap.vue'

type FormsTagSettings = {} & TagSettings

export class FormsTag extends ClientTag<FormsTagSettings> {
  constructor(tagSettings: FormsTagSettings) {
    super({ gen: 'core', ...tagSettings })
  }

  async init(): Promise<void> {
    const els = document.querySelectorAll('[data-kaption-embed]')

    els.forEach((el) => {
      const elem = el as HTMLElement

      const u = new URL(elem.dataset.kaptionEmbed as string)

      const mode = u.searchParams.get('mode') || 'inline'
      const trigger = u.searchParams.get('trigger') || 'click'

      // create element and append to body
      const embeddedEl = document.createElement('div')
      const embedId = `kaption-embed-${shortId()}`
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
