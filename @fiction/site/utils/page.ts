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
      isSingle: true,
      cards: [{ templateId: 'cardPostsMagazineV1' }],
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
      isArchive: true,
      cards: [{ templateId: 'cardPostsMagazineV1' }],
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

    if (card.isHome.value) {
      cardMap._ = card.cardId
    }
    else {
      cardMap[slug] = card.cardId
    }
  })

  // make sure we have a home page
  if (!cardMap._) {
    cardMap._ = pages.find(p => p.slug.value)?.cardId || '_special404'
  }

  // Set up dynamic routes for posts
  const singleCard = pages.find(p => p.settings.isSingle)
  if (singleCard) {
    cardMap.p = singleCard.cardId
  }
  const archiveCard = pages.find(p => p.settings.isArchive)
  if (archiveCard) {
    cardMap.a = archiveCard.cardId
  }

  // Ensure 404 page exists
  if (!cardMap._404) {
    cardMap._404 = '_special404'
  }

  return cardMap
}

export function activePageId(args: { site: Site }) {
  const { site } = args
  return vue.computed({
    get() {
      const viewId = site.siteRouter.current.value.params.viewId as string | undefined

      const v = viewId || '_'

      const viewMap = site.viewMap.value

      const cardId404 = viewMap._404 || '_special404'
      // Break recursion if _404 appears
      if (v?.includes('_404') || v?.includes('not-found'))
        return cardId404

      return viewMap[v] || cardId404
    },
    async set(cardId: string) {
      const currentViewId = site.siteRouter.current.value.params.viewId || '_'
      let viewId = Object.entries(site.viewMap.value).find(([_k, v]) => v === cardId)?.[0]

      if (viewId === currentViewId)
        return // Prevent re-push if already on the correct viewId

      if (viewId === '_')
        viewId = ''
      else if (viewId === '_404' || !viewId)
        viewId = 'not-found'

      await site.siteRouter.push(`/${viewId}`, { caller: 'activePageId' })
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
