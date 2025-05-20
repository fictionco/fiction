import type { Site } from '../index.js'
import type { CardConfigPortable } from '../tables.js'
import { data } from '@fiction/analytics/chart/test/sampleData.js'
import { log, vue } from '@fiction/core'
import { Card } from '../card.js'

const logger = log.contextLogger('sitePageUtils')

export function ensureStandardPages(args: { site?: Site, pages: Card[] }): Card[] {
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
      cards: [{ templateId: 'cardSinglePostV1' }],
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
      cards: [{ templateId: 'cardBlogV1', userConfig: { index: { sidebar: 'none', featuredCount: 0, imagePosition: 'right' } } }],
    }))
  }

  return [...pages, ...standardPages]
}

export async function setPages(args: { pages?: CardConfigPortable[], site?: Site }) {
  const { pages = [], site } = args
  const fictionEnv = site?.fictionSites.settings.fictionEnv

  const pg = await fictionEnv?.runHooks('setPages', pages, site) || pages || []

  const templateId = site?.theme.value?.templateDefaults.value.page || 'cardPageWrapV1'

  const pageCards = pg.map((p) => {
    const c = new Card({ site, regionId: 'main', templateId, ...p })
    return c
  }) || []

  return ensureStandardPages({ site, pages: pageCards })
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
    cardMap.archive = archiveCard.cardId
  }

  // Ensure 404 page exists
  if (!cardMap._404) {
    cardMap._404 = '_special404'
  }

  return cardMap
}

export function activePageIdByRoute(args: { site: Site }) {
  const { site } = args
  return vue.computed({
    get() {
      // Otherwise follow normal site navigation rules
      const viewId = site.currentViewId.value
      const viewMap = site.viewMap.value
      const cardId404 = viewMap._404 || '_special404'

      if (viewId?.includes('_404') || viewId?.includes('not-found'))
        return cardId404

      return viewMap[viewId] || cardId404
    },
    async set(cardId: string) {
      const pg = site.pages.value.find(_ => _.cardId === cardId)

      let location: string
      if (!pg) {
        logger.error('activePageIdByRoute: Page not found', { data: { cardId } })
        location = '/not-found'
      }
      else {
        const viewId = !pg.isHome.value && pg.slug.value ? pg.slug.value : '_'

        if (viewId === site.currentViewId.value)
          return // Prevent re-push if already on the correct viewId

        location = viewId === '_' ? '/' : `/${viewId}`
      }

      await site.siteRouter.push(location, { caller: 'activePageId' })
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
