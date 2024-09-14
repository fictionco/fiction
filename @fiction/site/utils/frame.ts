import type { ResetUiScope, ResetUiTrigger } from '@fiction/core'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil.js'
import type { Site } from '../index.js'
import type { CardConfigPortable, TableSiteConfig } from '../tables.js'
import { FictionObject, getUrlPath, resetUi, vue } from '@fiction/core'
import { activeSiteDisplayUrl, updateSite } from './site.js'

export type FramePostMessageList =
  | { messageType: 'setSite', data: { siteConfig: Partial<TableSiteConfig>, caller?: string } }
  | { messageType: 'setCard', data: { cardConfig: CardConfigPortable, caller?: string } }
  | { messageType: 'resetUi', data: { cause: string, scope: ResetUiScope, trigger: ResetUiTrigger } }
  | { messageType: 'setActiveCard', data: { cardId: string, caller?: string } }
  | { messageType: 'navigate', data: { urlOrPath: string, siteId: string } }
  | { messageType: 'frameReady', data: undefined }
  | { messageType: 'keypress', data: { key: string, direction: 'up' | 'down' } }

export type SiteFrameUtilityParams = {
  site: Site
  relation: 'parent' | 'child'
}

export class SiteFrameTools extends FictionObject<SiteFrameUtilityParams> {
  site = this.settings.site
  util: FrameUtility<FramePostMessageList> | undefined
  relation = vue.ref(this.settings.relation)
  private stopWatchCurrentPath?: () => void

  constructor(args: SiteFrameUtilityParams) {
    super('SiteFrameUtility', args)
  }

  // gets preveiw frame url for the current site - used to show preview in the admin
  currentSiteFrameUrl = vue.computed(() => {
    const s = this.site.fictionSites
    return `${s.adminBaseRoute}/preview/site/${this.site.siteId}${this.framePath.value}`
  })

  previewPath = vue.computed(() => this.site.fictionSites.getQueryItemPreviewPath.value)

  displayUrlBase = activeSiteDisplayUrl(this.site, { mode: 'display' })
  displayUrl = vue.computed(() => `${this.displayUrlBase.value}${this.site.currentPath.value}`)

  // path used for iframe url, we don't use currentPath as it causes full page reloads
  // so we only update this when the frame URL actually needs to change (not when the route changes from URL click in frame)
  framePath = vue.ref('')
  frameUrl = vue.computed(() => `${this.previewPath.value}${this.framePath.value}`)

  setUtil(util: FrameUtility<FramePostMessageList>) {
    this.util = util

    // Initialize the frame after setting the utility
    this.init({ caller: 'setUtil' })

    // sync site on initial load
    // this will make all cardIds the same in cases where they aren't (theme)
    if (this.relation.value === 'parent')
      this.syncSite({ caller: 'frameInit' })
  }

  init(_args: { caller?: string } = {}) {
    if (typeof window === 'undefined' || !this.util) {
      return
    }

    // Clear existing listeners
    this.clearListeners()

    // Add new listeners
    this.addListeners()
  }

  private clearListeners() {
    if (this.stopWatchCurrentPath) {
      this.stopWatchCurrentPath()
      this.stopWatchCurrentPath = undefined
    }

    this.site.fictionSites.fictionEnv.events.remove('resetUi', this.handleResetUi)
  }

  private handleResetUi = (event: CustomEvent<{ scope: ResetUiScope, trigger: ResetUiTrigger, cause: string }>) => {
    const { scope } = event.detail

    // prevent recursion
    if (scope === 'iframe')
      return

    this.send({ msg: { messageType: 'resetUi', data: event.detail } })
  }

  private addListeners() {
    const site = this.site
    const fictionEnv = site.fictionSites.fictionEnv
    // Add resetUi event listener
    fictionEnv.events.on('resetUi', this.handleResetUi)

    // Add currentPath watcher
    this.stopWatchCurrentPath = vue.watch(
      () => site.currentPath.value,
      (p) => {
        this.syncRoute({ urlOrPath: p, siteId: this.site.siteId })

        // only update iframe url if _reload in query
        if (site.siteRouter.query.value._reload && this.relation.value === 'parent')
          this.framePath.value = p
      },
      { immediate: true },
    )

    // Add cleanup callback
    fictionEnv.cleanupCallbacks.push(() => this.clearListeners())
  }

  updateFrameUrl(pathOrUrl: string) {
    const newPath = new URL(pathOrUrl, 'http://dummybase.com').pathname

    this.log.info('updateFrameUrl', { data: { newPath } })

    this.site.currentPath.value = newPath
  }

  syncRoute(args: { urlOrPath: string, siteId: string }) {
    const { urlOrPath, siteId } = args
    this.send({ msg: { messageType: 'navigate', data: { urlOrPath, siteId } } })
  }

  syncActiveCard(args: { cardId: string }) {
    this.send({ msg: { messageType: 'setActiveCard', data: args } })
  }

  syncCard(args: { caller: string, cardConfig: CardConfigPortable }) {
    if (!this.site)
      throw new Error('no site')

    if (!args.cardConfig.cardId)
      throw new Error('no cardId in config')

    this.send({ msg: { messageType: 'setCard', data: args } })
  }

  syncSite(args: { caller: string, siteConfig?: Partial<TableSiteConfig>, onlyKeys?: (keyof TableSiteConfig)[] }) {
    const { onlyKeys } = args

    const sendConfig = args.siteConfig || this.site.toConfig({ onlyKeys })
    const siteConfig = { siteId: this.site.siteId, ...sendConfig }

    this.log.info('syncSite', { data: siteConfig })

    this.send({ msg: { messageType: 'setSite', data: { siteConfig, ...args } } })
  }

  send(args: { msg: FramePostMessageList }) {
    const { msg } = args

    if (!this.util)
      this.log.warn(`${this.relation.value}: no frame utility found to send message: "${msg.messageType}"`, { data: msg })

    this.util?.sendMessage({ message: msg })
  }

  async processFrameMessage(args: { msg: FramePostMessageList, scope: 'child' | 'parent' }) {
    const { msg } = args
    const site = this.site

    switch (msg.messageType) {
      case 'resetUi': {
        const { trigger } = msg.data
        resetUi({ scope: 'iframe', cause: `iframeMessage:event-${msg.data.cause}`, trigger })
        this.site.fictionSites.fictionEnv.events.emit(`resetUi`, { scope: `iframe`, cause: `iframeMessage:fictionEnv-${msg.data.cause}`, trigger })
        break
      }

      case 'keypress': {
        const { key, direction } = msg.data
        this.site.fictionSites.fictionEnv.events.emit('keypress', { key, direction })
        break
      }

      case 'setSite': {
        const { siteConfig } = msg.data
        await updateSite({ site, newConfig: siteConfig })
        break
      }

      case 'setCard': {
        const { cardConfig } = msg.data
        const card = site.availableCards.value.find(c => c.cardId === cardConfig.cardId)
        if (card)
          card.update(cardConfig)
        else
          this.log.error('No card found', { data: { cardConfig } })

        break
      }

      case 'setActiveCard': {
        const { cardId } = msg.data

        site.setActiveCard({ cardId })
        break
      }

      case 'navigate': {
        const { urlOrPath, siteId } = msg.data
        if (siteId !== site.siteId)
          return

        const setPath = getUrlPath({ urlOrPath })
        site.currentPath.value = setPath
        break
      }

      case 'frameReady':{
        this.syncSite({ caller: 'frameReadyReceived' })
        break
      }

      default: {
        this.log.warn(`Unrecognized message type`, { data: msg })
        break
      }
    }
  }
}
