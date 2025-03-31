import type { FictionRouter } from '@fiction/core'
import type { Site } from '../index.js'
import type { CardConfigPortable } from '../tables.js'
import { log, vue } from '@fiction/core'
import { Card } from '../card.js'

const logger = log.contextLogger('sitePageUtils')

export function ensureStandardPages(args: { site: Site, pages: Card[] }): Card[] {
  const { site, pages } = args
  const templateId = site?.theme.value?.templateDefaults.value.page || 'cardPageWrapV1'
  const standardPages: Card[] = []

  // Check if we already have the standard pages
  const hasSinglePage = pages.some(p => p.slug.value === '_p')
  const hasArchivePage = pages.some(p => p.slug.value === '_archive')

  // Add single post page if missing
  if (!hasSinglePage) {
    standardPages.push(new Card({
      site,
      regionId: 'main',
      templateId,
      slug: '_p',
      title: 'Post Single',
      isSystem: true,
      cards: [{ templateId: 'cardPostsMagazineV1', userConfig: { isSingle: true } }],
    }))
  }

  // Add archive page if missing
  if (!hasArchivePage) {
    standardPages.push(new Card({
      site,
      regionId: 'main',
      templateId,
      slug: '_archive',
      title: 'Post Archive',
      isSystem: true,
      cards: [{ templateId: 'cardPostsMagazineV1', userConfig: { isArchive: true } }],
    }))
  }

  return [...pages, ...standardPages]
}

export async function setPages(args: { pages?: CardConfigPortable[], site?: Site }) {
  const { pages = [], site } = args
  const fictionEnv = site?.fictionSites.settings.fictionEnv

  const pg = await fictionEnv?.runHooks('setPages', pages, site) || pages || []

  const templateId = site?.theme.value?.templateDefaults.value.page || 'cardPageWrapV1'

  const pageCards = pg.map(p => new Card({ site, regionId: 'main', templateId, ...p })) || []

  return pageCards
}

export function updatePages(args: { site: Site, pages: (CardConfigPortable | undefined)[] }) {
  const { site, pages } = args

  pages.filter(Boolean).forEach((pageConfig) => {
    const c = pageConfig as CardConfigPortable
    if (c.cardId) {
      const ind = site.pages.value.findIndex(r => r.cardId === c?.cardId)
      if (ind > -1)
        site.pages.value[ind].update(c || {}, { caller: 'updatePages' })
    }
  })
}

// Enhance getViewMap to handle dynamic routes
export function getViewMap(args: { pages: Card[] }) {
  const { pages } = args
  const cardMap: Record<string, string> = {}

  pages.forEach((card) => {
    const slug = card.slug.value
    if (!slug)
      return

    cardMap[slug] = card.cardId

    if (card.isHome.value)
      cardMap._home = card.cardId
    if (card.is404.value)
      cardMap._404 = card.cardId
  })

  // Set up dynamic routes for posts
  const singleCard = pages.find(p => p.slug.value === '_p')
  if (singleCard) {
    cardMap.p = singleCard.cardId
  }

  // Ensure 404 page exists
  if (!cardMap._404) {
    const fallback404 = pages.find(p => p.is404.value)?.cardId || '_special404'
    cardMap._404 = fallback404
  }

  return cardMap
}

export function activePageId(args: { siteRouter: FictionRouter, viewMapRef: vue.Ref<Record<string, string>> }) {
  const { siteRouter, viewMapRef } = args
  return vue.computed({
    get() {
      const viewId = (siteRouter.current.value.params.viewId || '_home') as string
      const viewMap = viewMapRef.value

      // Break recursion if _404 appears
      if (viewId.includes('_404') || viewId.includes('not-found'))
        return viewMap._404 || '_special404'

      return viewMap[viewId] || viewMap._404 || '_special404'
    },
    async set(cardId: string) {
      const { siteRouter } = args
      const currentViewId = siteRouter.current.value.params.viewId || '_home'
      let viewId = Object.entries(viewMapRef.value).find(([_k, v]) => v === cardId)?.[0]

      if (viewId === currentViewId)
        return // Prevent re-push if already on the correct viewId

      if (viewId === '_home')
        viewId = ''
      else if (viewId === '_404' || !viewId)
        viewId = 'not-found'

      await siteRouter.push(`/${viewId}`, { caller: 'activePageId' })
    },
  })
}

export function getPageById(args: { pageId: string, site: Site }) {
  const { pageId, site } = args

  const pages = site.pages.value

  // Find the corresponding Card object in the pages
  let activeCard = pages.find(card => card.cardId === pageId)

  // Handle case where the Card is not found
  if (!activeCard) {
    activeCard = new Card({
      site,
      cardId: '_special404',
      title: 'Not Found',
      templateId: 'cardPageWrapV1',
      is404: true,
      cards: [{ templateId: 'card404ErrorV1', userConfig: { heading: 'Nothing here' } }],
    })
  }

  return activeCard
}

export async function getPageWordCount(args: { page: CardConfigPortable }) {
  const { getObjectWordCount } = await import('@fiction/core/utils/wordCount.js')
  const { page } = args
  let total = 0

  // Get words from page userConfig
  if (page.userConfig) {
    total += getObjectWordCount(page.userConfig)
  }

  // Get words from child cards' userConfig
  if (page.cards?.length) {
    total += page.cards.reduce((sum, card) => {
      if (card.userConfig) {
        sum += getObjectWordCount(card.userConfig)
      }
      return sum
    }, 0)
  }

  return total
}
