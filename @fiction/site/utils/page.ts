import type { Site } from '../index.js'
import type { CardConfigPortable } from '../tables.js'
import { log, vue } from '@fiction/core'
import { Card } from '../card.js'

const logger = log.contextLogger('sitePageUtils')

function getActivePageIdInNormalMode(site: Site): string {
  const viewId = site.currentViewId.value
  const viewMap = site.viewMap.value

  return viewMap[viewId] || '_special404'
}

async function setActivePageInNormalMode(site: Site, cardId: string): Promise<void> {
  // Don't try to navigate to special 404 - it's handled by getPageById
  if (cardId === '_special404')
    return

  const page = site.pages.value.find(p => p.cardId === cardId)
  if (!page) {
    logger.warn('Page not found for cardId', { data: { cardId } })
    return
  }

  const viewId = page.isHome.value ? '_' : page.slug.value
  const currentViewId = site.currentViewId.value

  if (viewId === currentViewId)
    return

  const location = viewId === '_' ? '/' : `/${viewId}`
  await site.siteRouter.push(location, { caller: 'activePageId:normal' })
}

export function activePageIdByRoute(args: { site: Site }) {
  const { site } = args
  const isStatic = site.settings.isStatic

  return vue.computed({
    get() {
      const editorPageId = site.siteRouter.query.value?._pageCardId as string | undefined
      if (editorPageId && !isStatic)
        return editorPageId

      return getActivePageIdInNormalMode(site)
    },

    async set(cardId: string) {
      if (site.isEditable.value && !isStatic) {
        const query = site.siteRouter.query.value
        if (query._pageCardId !== cardId) {
          await site.siteRouter.replace({ query: { ...query, _pageCardId: cardId } }, { caller: 'activePageId:editor' })
        }
      }
      else {
        await setActivePageInNormalMode(site, cardId)
      }
    },
  })
}

export function getPageById(args: { pageId: string, site: Site }) {
  const { pageId, site } = args

  const page = site.pages.value.find(card => card.cardId === pageId)

  if (page)
    return page

  // Return 404 page when not found
  return new Card({
    site,
    cardId: '_special404',
    title: 'Not Found',
    templateId: 'cardPageWrapV1',
    cards: [{ templateId: 'card404ErrorV1', userConfig: { heading: 'Nothing here' } }],
  })
}

export function ensureStandardPages(args: { site?: Site, pages: Card[] }): Card[] {
  const { site, pages } = args
  const templateId = site?.theme.value?.templateDefaults.value.page || 'cardPageWrapV1'
  const standardPages: Card[] = []

  const hasSinglePage = pages.some(p => p.slug.value === '_p')
  const hasArchivePage = pages.some(p => p.slug.value === '_archive')
  const hasManagePage = pages.some(p => p.slug.value === '_manage')

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

  if (!hasManagePage) {
    standardPages.push(new Card({
      site,
      regionId: 'main',
      templateId,
      slug: '_manage',
      title: 'Manage Account',
      isSystem: true,
      cards: [{ templateId: 'cardManageContactV1' }],
    }))
  }

  return [...pages, ...standardPages]
}

export async function setPages(args: { pages?: CardConfigPortable[], site?: Site }) {
  const { pages = [], site } = args
  const fictionEnv = site?.fictionSites.settings.fictionEnv

  const processedPages = await fictionEnv?.runHooks('setPages', pages, site) || pages || []
  const templateId = site?.theme.value?.templateDefaults.value.page || 'cardPageWrapV1'

  const pageCards = processedPages.map((p) => {
    return new Card({ site, regionId: 'main', templateId, ...p })
  }) || []

  return ensureStandardPages({ site, pages: pageCards })
}

export function updatePages(args: { site: Site, pages: (CardConfigPortable | undefined)[] }) {
  const { site, pages } = args

  pages.filter(Boolean).forEach((pageConfig) => {
    const config = pageConfig as CardConfigPortable
    if (!config.cardId)
      return

    const pageIndex = site.pages.value.findIndex(page => page.cardId === config.cardId)
    if (pageIndex > -1) {
      site.pages.value[pageIndex].update(config, { caller: 'updatePages' })
    }
  })
}

export function getViewMap(args: { pages: Card[] }) {
  const { pages } = args
  const cardMap: Record<string, string> = {}

  // Map regular pages
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

  // Ensure home page exists
  if (!cardMap._) {
    cardMap._ = pages.find(p => p.slug.value)?.cardId || '_special404'
  }

  // single posts
  const singleCard = pages.find(p => p.settings.isSingle)
  if (singleCard) {
    cardMap.p = singleCard.cardId
  }

  // list of posts
  const archiveCard = pages.find(p => p.settings.isArchive)
  if (archiveCard) {
    cardMap.archive = archiveCard.cardId
  }

  // Subscriber management page
  const manageCard = pages.find(p => p.slug.value === '_manage')
  if (manageCard) {
    cardMap.m = manageCard.cardId
  }

  // Ensure 404 page exists
  if (!cardMap._404) {
    cardMap._404 = '_special404'
  }

  return cardMap
}

export async function getPageWordCount(args: { page: CardConfigPortable }) {
  const { getObjectWordCount } = await import('@fiction/core/utils/wordCount.js')
  const { page } = args
  let total = 0

  if (page.userConfig) {
    total += getObjectWordCount(page.userConfig)
  }

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
