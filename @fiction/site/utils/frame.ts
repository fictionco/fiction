import { FictionObject, getUrlPath, onResetUi, resetUi, vue } from '@fiction/core'
import type { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil.js'
import type { Site } from '../index.js'
import type { CardConfigPortable, TableSiteConfig } from '../tables.js'
import { activeSiteDisplayUrl, updateSite } from './site.js'

export type FramePostMessageList =
  | { messageType: 'setSite', data: { siteConfig: Partial<TableSiteConfig>, caller?: string } }
  | { messageType: 'setCard', data: { cardConfig: CardConfigPortable, caller?: string } }
  | { messageType: 'resetUi', data: undefined }
  | { messageType: 'setActiveCard', data: { cardId: string, caller?: string } }
  | { messageType: 'navigate', data: { urlOrPath: string, siteId: string } }
  | { messageType: 'frameReady', data: undefined }

export type SiteFrameUtilityParams = {
  site: Site
  relation: 'parent' | 'child'
}

export class SiteFrameTools extends FictionObject<SiteFrameUtilityParams> {
  site = this.settings.site
  util: FrameUtility<FramePostMessageList> | undefined
  relation = this.settings.relation

  constructor(args: SiteFrameUtilityParams) {
    super('SiteFrameUtility', args)
  }

  previewFrameUrl = vue.computed(() => {
    const s = this.site.fictionSites
    return `${s.adminBaseRoute}/preview/site/${this.site.siteId}${this.framePath.value}`
  })

  previewPath = vue.computed(() => this.site.fictionSites.getPreviewPath.value)
  frameUrl = vue.computed(() => `${this.previewPath.value}${this.framePath.value}`)

  displayUrlBase = activeSiteDisplayUrl(this.site, { mode: 'display' })
  displayUrl = vue.computed(() => `${this.displayUrlBase.value}${this.site.currentPath.value}`)

  // path used for iframe url, we don't use currentPath as it causes full page reloads
  // so we only update this when the frame URL actually needs to change (not when the route changes from URL click in frame)
  framePath = vue.ref('')

  setUtil(util: FrameUtility<FramePostMessageList>) {
    this.util = util

    // sync site on initial load
    // this will make all cardIds the same in cases where they aren't (theme)
    if (this.relation === 'parent')
      this.syncSite({ caller: 'frameInit' })
  }

  init(_args: { caller?: string } = {}) {
    const site = this.site

    const fictionEnv = site.fictionSites.fictionEnv

    if (fictionEnv.isNode)
      return

    // propagate resetUi events between frames
    fictionEnv.events.on('resetUi', (event) => {
      const { scope } = event.detail
      // prevent recursion
      if (scope === 'iframe')
        return

      this.send({ msg: { messageType: 'resetUi', data: undefined } })
    })

    const stopWatch = vue.watch(
      () => site.currentPath.value,
      (p) => {
        if (this.relation === 'child')
          this.send({ msg: { messageType: 'navigate', data: { urlOrPath: p, siteId: this.site.siteId } } })

        else
          this.framePath.value = p
      },
      { immediate: true },
    )

    fictionEnv.cleanupCallbacks.push(() => stopWatch())
  }

  updateFrameUrl(pathOrUrl: string) {
    const newPath = new URL(pathOrUrl, 'http://dummybase.com').pathname

    this.log.info('updateFrameUrl', { data: { newPath } })

    this.site.currentPath.value = newPath
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
      this.log.warn('No frame utility found')

    this.util?.sendMessage({ message: msg })
  }

  processFrameMessage(args: { msg: FramePostMessageList, scope: 'child' | 'parent' }) {
    const { msg } = args
    const site = this.site
    switch (msg.messageType) {
      case 'resetUi': {
        resetUi({ scope: 'iframe', cause: 'iframeSiteRender' })
        break
      }

      case 'setSite': {
        const { siteConfig } = msg.data
        updateSite({ site, newConfig: siteConfig })
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
        site.editor.value.selectedCardId = cardId
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
        break
      }

      default: {
        this.log.warn(`Unrecognized message type`, { data: msg })
        break
      }
    }
  }
}
