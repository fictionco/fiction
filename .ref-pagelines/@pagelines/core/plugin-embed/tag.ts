import type { App, Component } from 'vue'
import { createApp } from 'vue'
import { shortId, waitFor } from '@factor/api/utils/utils'
import { emitEvent } from '@factor/api/utils/event'
import { onHistoryChange } from '@factor/api/utils-analytics/history'
import { ClientTag } from '@factor/api/tag/clientTag'
import type { TagSettings } from '@factor/api/tag/types'
import type { TableAgentConfig } from '../tables'
import EmbedWrap from './EmbedWrap.vue'
import type {
  EmbedItemConfig,
  EmbedMode,
  EmbedPosition,
  EmbedTrigger,
} from './util'

type AgentEmbedTagSettings = {
  agentBaseUrl?: string
  agents?: (Partial<TableAgentConfig> | undefined)[]
} & TagSettings

export class AgentEmbedTag extends ClientTag<AgentEmbedTagSettings> {
  agentBaseUrl = this.settings.agentBaseUrl

  agents = this.settings.agents || []
  app: Record<string, App<Element>> = {}
  clickHandlers: Record<string, (e: MouseEvent) => void> = {}
  el: Record<string, HTMLDivElement | undefined> = {}
  constructor(tagSettings: AgentEmbedTagSettings) {
    super('embedTag', { gen: 'core', ...tagSettings })

    if (!this.agentBaseUrl)
      throw new Error('no baseUrl for agent')
  }

  async cleanup() {
    Object.values(this.app).forEach((app) => {
      app.unmount()
    })

    Object.values(this.el).forEach((el) => {
      el?.remove()
    })

    this.app = {}
    this.el = {}
  }

  embedItem(args: EmbedItemConfig) {
    const { originalEl, agentId, embedId, mode, trigger, position } = args

    if (!agentId)
      throw new Error('no agent id')
    if (!embedId)
      throw new Error('no embed id')
    if (!originalEl)
      throw new Error('no original element')

    if (this.app[agentId]) {
      this.app[agentId].unmount()
      this.el[agentId]?.remove()
    }

    // create element and append to body
    const newEl = document.createElement('div')
    const elementId = `pl-embed-${embedId}`

    const agentConfig = this.agents.find(a => a?.agentId === agentId) || {
      options: {},
    }

    const overrides = { mode, trigger, position }
    const validOverrides = Object.fromEntries(
      Object.entries(overrides).filter(([_k, v]) => v),
    )

    // Update the options in agentConfig using the passed-in values, while preserving the existing ones
    const o = { ...agentConfig.options, ...validOverrides }
    agentConfig.options = o

    this.log.info('setting options', {
      data: { embedId, o, agentConfig, args },
    })

    const url = new URL(
      `${this.agentBaseUrl}/${agentId}?mode=${o.mode}&trigger=${o.trigger}&position=${o.position}`,
    )

    const props = {
      elementId,
      agentConfig,
      url: url.toString(),
    }
    newEl.id = elementId

    if (mode === 'inline') {
      originalEl.replaceWith(newEl)
    }
    else {
      this.log.info(`appending agent ${embedId}`, { data: { props, o } })
      document.body.append(newEl)

      /**
       * If trigger is click, leave original element in place and activate on click
       */
      if (o.trigger === 'click') {
        // Remove old event listener, if exists.
        if (this.clickHandlers[embedId])
          originalEl.removeEventListener('click', this.clickHandlers[embedId])

        // Define a new listener.
        const clickHandler = (e: MouseEvent) => {
          e.preventDefault()
          console.warn('click originalEl', props)
          setTimeout(() => {
            emitEvent('triggerEmbed', props)
          }, 10)
        }

        // Store the new listener in the clickHandlers object.
        this.clickHandlers[embedId] = clickHandler

        // Attach the new listener.
        console.warn('attaching listener', originalEl)
        originalEl.addEventListener('click', clickHandler)
      }
    }

    this.el[embedId] = newEl
    this.app[embedId] = createApp(EmbedWrap as Component, props)
    this.app[embedId].mount(newEl)
  }

  async runPage(): Promise<void> {
    await waitFor(500)

    const els = document.querySelectorAll('[data-pl-agent-id]')

    this.log.info(`initializing embed found ${els?.length} agents`)

    els.forEach((elem) => {
      const el = elem as HTMLElement
      const agentId = el.dataset.plAgentId
      if (!agentId) {
        console.warn('No agent id found', { el })
        return
      }

      const embedId = el.dataset.plEmbedId || `${agentId}-${shortId()}`

      // set pl-data-embed-id to embedId and attr
      el.dataset.plEmbedId = embedId

      const trigger = el.dataset.plTrigger as EmbedTrigger | undefined
      const mode = el.dataset.plMode as EmbedMode | undefined
      const position = el.dataset.plPosition as EmbedPosition | undefined

      this.embedItem({
        originalEl: el,
        agentId,
        embedId,
        mode,
        trigger,
        position,
      })
    })
  }

  async init(): Promise<void> {
    if (document.readyState === 'complete') {
      await this.runPage()
    }
    else {
      window.addEventListener('load', async () => {
        await this.runPage()
      })
    }

    onHistoryChange(async () => {
      console.warn('XXX popstate')
      await this.cleanup()
      await this.runPage()
    })
  }
}

export async function setup(tagSettings: AgentEmbedTagSettings) {
  return new AgentEmbedTag(tagSettings)
}
