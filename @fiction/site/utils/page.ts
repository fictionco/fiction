import type { FictionRouter } from '@fiction/core'
import type { Site } from '../index.js'
import type { CardConfigPortable } from '../tables.js'
import { log, vue } from '@fiction/core'
import { Card } from '../card.js'

const logger = log.contextLogger('sitePageUtils')
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

export function getViewMap(args: { pages: Card[] }) {
  const { pages } = args
  const cardMap: Record<string, string> = {}

  pages.forEach((card) => {
    // Use the provided slug or generate one from the title.
    const slug = card.slug.value

    if (!slug)
      return

    cardMap[slug] = card.cardId // Map the slug or title-slug to cardId

    // Check for isHome and is404 directly on the card.
    if (card.isHome.value)
      cardMap._home = card.cardId

    if (card.is404.value)
      cardMap._404 = card.cardId

    // use simple underscore for itemId on home page /_/:itemId
    cardMap._ = cardMap._home
  })

  // Ensure we have a 404 page
  if (!cardMap._404) {
    // Find first 404 page or create fallback ID
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

      let viewId = Object.entries(viewMapRef.value).find(([_k, v]) => v === cardId)?.[0]

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
