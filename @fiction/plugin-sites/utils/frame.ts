import { FactorObject, getUrlPath, onResetUi, resetUi, vue } from '@fiction/core'
import type { FrameUtility } from '@fiction/ui/elBrowserFrameUtil'
import type { Site } from '..'
import type { CardConfigPortable, TableSiteConfig } from '../tables'
import { updateSite } from './site'

export type FramePostMessageList =
  | { messageType: 'setSite', data: { siteConfig: Partial<TableSiteConfig>, caller?: string } }
  | { messageType: 'setCard', data: { cardConfig: CardConfigPortable, caller?: string } }
  | { messageType: 'resetUi', data: undefined }
  | { messageType: 'setActiveCard', data: { cardId: string, caller?: string } }
  | { messageType: 'navigate', data: { urlOrPath: string } }
  | { messageType: 'frameReady', data: undefined }

export type SiteFrameUtilityParams = {
  site: Site
  relation: 'parent' | 'child'
}

export class SiteFrameTools extends FactorObject<SiteFrameUtilityParams> {
  site = this.settings.site
  util: FrameUtility<FramePostMessageList> | undefined
  relation = this.settings.relation

  constructor(args: SiteFrameUtilityParams) {
    super('SiteFrameUtility', args)
  }

  previewFrameUrl = vue.computed(() => {
    const s = this.site.factorSites.settings
    return `${s.factorAdmin.adminBaseRoute}/preview/site/${this.site.siteId}${this.framePath.value}`
  })

  previewPath = vue.computed(() => this.site.factorSites.getPreviewPath({ factorAdmin: this.site.factorSites.settings.factorAdmin }).value)
  frameUrl = vue.computed(() => `${this.previewPath.value}${this.framePath.value}`)

  displayUrlBase = this.activeSiteDisplayUrl()
  displayUrl = vue.computed(() => `${this.displayUrlBase.value}${this.site.currentPath.value}`)

  // path used for iframe url, we don't use currentPath as it causes full page reloads
  // so we only update this when the frame URL actually needs to change (not when the route changes from URL click in frame)
  framePath = vue.ref('')
  existingFramePath = vue.ref('')

  activeSiteDisplayUrl() {
    const site = this.site
    return vue.computed(() => {
      const port = site.factorSites.settings.factorAppSites?.port
      const hostname = this.site.primaryCustomDomain.value ? this.site.primaryCustomDomain.value : this.site.hostname.value
      const baseUrl = site.isProd.value ? `https://${hostname}` : `http://${hostname}:${port}`

      return baseUrl
    })
  }

  setUtil(util: FrameUtility<FramePostMessageList>) {
    this.util = util

    // sync site on initial load
    // this will make all cardIds the same in cases where they aren't (theme)
    if (this.relation === 'parent')
      this.syncSite({ caller: 'frameInit' })
  }

  init(_args: { caller?: string } = {}) {
    const site = this.site

    // propagate resetUi events between frames
    onResetUi((args) => {
      // prevent recursion
      if (args.scope === 'iframe')
        return

      this.send({ msg: { messageType: 'resetUi', data: undefined } })
    })

    vue.watch(
      () => site.currentPath.value,
      (p) => {
        if (this.relation === 'child')
          this.send({ msg: { messageType: 'navigate', data: { urlOrPath: p } } })

        else if (this.existingFramePath.value !== p)
          this.framePath.value = p
      },
      { immediate: true },
    )
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
        site.settings.factorSites.useTool({ toolId: '' })
        break
      }

      case 'setSite': {
        const { siteConfig } = msg.data
        updateSite({ site, newConfig: siteConfig })
        break
      }

      case 'setCard': {
        const { cardConfig } = msg.data
        const card = site.allLayoutCards.value.find(c => c.cardId === cardConfig.cardId)
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
        const { urlOrPath } = msg.data
        const setPath = getUrlPath({ urlOrPath })
        this.existingFramePath.value = setPath
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
