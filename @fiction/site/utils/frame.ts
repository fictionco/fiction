import type { ResetUiScope, ResetUiTrigger } from '@fiction/core'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil.js'
import type { Site } from '../index.js'
import type { SiteMode } from '../load.js'
import type { ToolKeys } from '../plugin-builder/tools/tools.js'
import type { CardConfigPortable, TableSiteConfig } from '../tables.js'
import type { HistoryEntry } from './history.js'
import { FictionObject, resetUi, vue } from '@fiction/core'
import { updateSite } from './site.js'

export type FramePostMessageList =
  | { messageType: 'setSite', data: { siteConfig: Partial<TableSiteConfig>, caller?: string } }
  | { messageType: 'setCard', data: { cardConfig: CardConfigPortable, caller?: string } }
  | { messageType: 'resetUi', data: { cause: string, scope: ResetUiScope, trigger: ResetUiTrigger } }
  | { messageType: 'setActiveCard', data: { cardId: string, caller?: string } }
  | { messageType: 'setEditPath', data: { cardId: string, path: string, caller?: string } }
  | { messageType: 'setToolId', data: { toolId: ToolKeys | '' } }
  | { messageType: 'navigate', data: { pageCardId: string, siteId: string } }
  | { messageType: 'frameReady', data: undefined }
  | { messageType: 'keypress', data: { key: string, direction: 'up' | 'down' } }
  | { messageType: 'historyEntry', data: { historyEntry: HistoryEntry } }

export type SiteFrameUtilityParams = {
  site: Site
  relation: 'parent' | 'child'
}

export class SiteFrameTools extends FictionObject<SiteFrameUtilityParams> {
  site = this.settings.site
  util: FrameUtility<FramePostMessageList> | undefined
  relation = vue.ref(this.settings.relation)
  private stopWatchActivePageId?: () => void
  messageQueue: FramePostMessageList[] = []

  constructor(args: SiteFrameUtilityParams) {
    super('SiteFrameUtility', args)
  }

  previewPath = vue.computed(() => `${this.site.fictionSites.previewRoute}/site/${this.site.siteId}`)

  // Editor uses cardId-based URLs exclusively for stability
  frameUrl = vue.computed(() => {
    return this.framePageUrl({
      pageCardId: this.site.activePageId.value || this.site.homePageId.value,
      siteMode: 'editable',
    })
  })

  framePageUrl = (args?: { pageCardId?: string, siteMode?: SiteMode }) => {
    const { pageCardId, siteMode = 'standard' } = args || {}
    const s = new URLSearchParams({ _scope: 'draft' })
    if (pageCardId)
      s.set('_pageCardId', pageCardId)
    if (siteMode)
      s.set('_siteMode', siteMode)

    return `${this.previewPath.value}?${s.toString()}`
  }

  setUtil(util: FrameUtility<FramePostMessageList>) {
    this.util = util
    this.init({ caller: 'setUtil' })

    // Process queued messages
    this.messageQueue.forEach(msg => this.util?.sendMessage({ message: msg }))
    this.messageQueue = []

    if (this.relation.value === 'parent')
      this.syncSite({ caller: 'frameInit' })
  }

  init(_args: { caller?: string } = {}) {
    if (typeof window === 'undefined' || !this.util)
      return

    this.clearListeners()
    this.addListeners()
  }

  private clearListeners() {
    this.stopWatchActivePageId?.()
    this.stopWatchActivePageId = undefined
    this.site.fictionSites.fictionEnv.events.remove('resetUi', this.handleResetUi)
  }

  private handleResetUi = (event: CustomEvent<{ scope: ResetUiScope, trigger: ResetUiTrigger, cause: string }>) => {
    if (event.detail.scope === 'iframe')
      return
    this.send({ msg: { messageType: 'resetUi', data: event.detail } })
  }

  private addListeners() {
    const site = this.site
    const fictionEnv = site.fictionSites.fictionEnv

    fictionEnv.events.on('resetUi', this.handleResetUi)
    fictionEnv.events.on('keypress', event => this.send({
      msg: { messageType: 'keypress', data: event.detail },
    }))

    // Watch for active page changes and sync via cardId
    this.stopWatchActivePageId = vue.watch(
      () => site.activePageId.value,
      (pageCardId) => {
        if (pageCardId) {
          this.syncRoute({ pageCardId, siteId: site.siteId })
        }
      },
      { immediate: true },
    )

    fictionEnv.cleanupCallbacks.push(() => this.clearListeners())
  }

  syncRoute(args: { pageCardId: string, siteId: string }) {
    this.send({ msg: { messageType: 'navigate', data: args } })
  }

  syncActiveCard(args: { cardId: string }) {
    this.send({ msg: { messageType: 'setActiveCard', data: args } })
  }

  syncEditPath(args: (FramePostMessageList & { messageType: 'setEditPath' })['data']) {
    this.send({ msg: { messageType: 'setEditPath', data: args } })
  }

  syncTool(args: { toolId: ToolKeys | '' }) {
    this.send({ msg: { messageType: 'setToolId', data: args } })
  }

  syncCard(args: { caller: string, cardConfig: CardConfigPortable }) {
    if (!this.site)
      throw new Error('no site')
    if (!args.cardConfig.cardId)
      throw new Error('no cardId in config')

    this.send({ msg: { messageType: 'setCard', data: args } })
  }

  syncSite(args: { caller: string, siteConfig?: Partial<TableSiteConfig>, onlyKeys?: (keyof TableSiteConfig)[] }) {
    const { onlyKeys, caller } = args
    const sendConfig = args.siteConfig || this.site.toConfig({ onlyKeys })
    const siteConfig = { siteId: this.site.siteId, ...sendConfig }

    this.send({ msg: { messageType: 'setSite', data: { siteConfig, caller } } })
  }

  syncHistoryEntry(args: { historyEntry: HistoryEntry }) {
    this.send({ msg: { messageType: 'historyEntry', data: args } })
  }

  send(args: { msg: FramePostMessageList }) {
    if (!this.util) {
      this.messageQueue.push(args.msg) // Queue instead of warning
      return
    }

    this.util.sendMessage({ message: args.msg })
  }

  async processFrameMessage(args: { msg: FramePostMessageList, scope?: 'child' | 'parent' }) {
    const { msg } = args
    const site = this.site

    switch (msg.messageType) {
      case 'resetUi': {
        const { trigger } = msg.data
        resetUi({ scope: 'iframe', cause: `iframeMessage:${msg.data.cause}`, trigger })
        site.fictionSites.fictionEnv.events.emit('resetUi', {
          scope: 'iframe',
          cause: `iframeMessage:${msg.data.cause}`,
          trigger,
        })
        break
      }

      case 'keypress': {
        site.fictionSites.fictionEnv.events.emit('keypress', msg.data)
        break
      }

      case 'setSite': {
        await updateSite({ site, newConfig: msg.data.siteConfig, caller: 'frameMessage:setSite' })
        break
      }

      case 'setCard': {
        const { cardConfig, caller = 'frameMessage' } = msg.data
        const card = site.availableCards.value.find(c => c.cardId === cardConfig.cardId)

        if (card) {
          card.update(cardConfig, { caller: `${caller}:setCard` })
        }
        else {
          this.log.error('Card not found', { data: { cardConfig } })
        }
        break
      }

      case 'historyEntry': {
        site.history.saveState(msg.data.historyEntry)
        break
      }

      case 'setToolId': {
        site.editorActivateTool({ toolId: msg.data.toolId })
        break
      }

      case 'setEditPath': {
        site.editor.value.editPath = msg.data.path
        break
      }

      case 'setActiveCard': {
        site.setActiveCard(msg.data)
        break
      }

      case 'navigate': {
        const { pageCardId } = msg.data
        site.activePageId.value = pageCardId
        break
      }

      case 'frameReady': {
        this.syncSite({ caller: 'frameReady' })
        break
      }

      default: {
        this.log.warn('Unknown message type', { data: msg })
        break
      }
    }
  }
}
