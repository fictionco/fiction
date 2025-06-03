import type { FictionRouter, Organization, RunVars } from '@fiction/core'
import type { ManageSiteParams } from './endpoint.js'
import type { FictionSites, TableSiteConfig } from './index.js'
import { log, toCamel } from '@fiction/core'
import { CardFactory } from './cardFactory.js'
import { Site } from './index.js'

const logger = log.contextLogger('siteLoader')

/**
 * SiteMode establishes the context in which the site is being loaded.
 * - designer: the site is being loaded in the parent designer frame, editing another site in iframe
 * - editable: the site is in iframe and editable by the user
 * - standard: the site is being loaded in a standard context, not editable
 * - coding: the site is being loaded manually, and coded to run directly
 */
export type SiteMode = 'designer' | 'editable' | 'standard' | 'coding'

export type WhereSite = {
  orgId?: string
  handle?: string
  siteId?: string
  subDomain?: string
  hostname?: string
  themeId?: string
  internal?: string
  cardId?: string
} & (
  | { siteId: string }
  | { subDomain: string }
  | { hostname: string }
  | { themeId: string }
  | { internal: string }
  | { cardId: string }
  | { orgId: string }
  | { handle: string }
)

type MountContext = { siteMode?: SiteMode, contextCacheKey?: string } & WhereSite
type RequestManageSiteParams = ManageSiteParams & { siteRouter: FictionRouter, fictionSites: FictionSites, siteMode: SiteMode, orgId?: string, siteId?: string }

export async function requestManageSite(args: RequestManageSiteParams) {
  const { _action, siteMode, caller = 'requestManageSite', fields = {}, where, revisionId } = args
  const { fictionSites, siteRouter, ...pass } = args

  logger.debug(`request manage site:${_action}`, { data: { fields, where } })

  const routeScope = siteRouter.query.value._scope as string | undefined

  let scope: 'publish' | 'draft' = routeScope === 'draft' ? 'draft' : 'publish'

  if (['update', 'delete', 'retrieve'].includes(_action)) {
    const { _action, where } = args
    if (!where || !Object.keys(where).length) {
      logger.error(`REQUEST SITE WHERE -> no siteId or subDomain ${_action}`)
      return {}
    }
  }
  else if (_action === 'restoreFromRevision') {
    if (!revisionId) {
      logger.error('REQUEST SITE WHERE -> no revisionId')
      return {}
    }
  }

  if (_action === 'retrieve') {
    if (['designer', 'editable'].includes(siteMode))
      scope = 'draft'
  }

  const requestArgs = { ...pass, caller, _action, fields, where, scope } as ManageSiteParams

  logger.info('fetching site', { data: { caller } })

  const r = await fictionSites.requests.ManageSite.projectRequest(requestArgs, { caller: `requestManageSite:${caller}`, userOptional: _action === 'retrieve' })

  let site: Site | undefined = undefined
  if (r.data?.siteId)
    site = await Site.create({ ...r.data, fictionSites, siteRouter, siteMode })

  return { site, response: r }
}

export async function loadSiteById(args: { where: WhereSite, siteRouter: FictionRouter, fictionSites: FictionSites, siteMode: SiteMode, caller?: string }): Promise<Site | undefined> {
  const { where, siteRouter, fictionSites, siteMode, caller = 'loadSiteById' } = args

  const { site } = await requestManageSite({
    where,
    _action: 'retrieve',
    siteRouter,
    fictionSites,
    caller,
    siteMode,
  })

  return site
}

export async function loadSiteFromTheme(args: {
  themeId: string
  siteRouter: FictionRouter
  fictionSites: FictionSites
  siteMode: SiteMode
  caller?: string
  siteConfig?: Partial<TableSiteConfig>
}): Promise<Site> {
  const { themeId, siteRouter, fictionSites, siteMode, caller } = args
  const availableThemes = fictionSites.themes.value
  const theme = availableThemes.find(t => t.themeId === themeId)
  const orgId = fictionSites.fictionEnv.meta.systemOrgId
  const fictionUser = fictionSites.settings.fictionUser

  if (!orgId) {
    throw new Error(`loadSiteFromTheme: orgId required (caller:${caller})`)
  }

  if (!fictionUser) {
    throw new Error(`loadSiteFromTheme: fictionUser not available (caller:${caller})`)
  }

  const subDomain = `theme-${themeId}`
  const siteId = `${orgId}-${subDomain}`

  let org: Organization | undefined = undefined
  if (fictionSites && orgId && !org) {
    const r = await fictionSites.settings.fictionUser?.requests.ManageOrganization.request({ _action: 'read', where: { orgId } }, { caller: 'loadSiteFromTheme' })
    if (r?.data?.orgId)
      org = r.data
  }

  if (!theme) {
    const msg = `${caller}: no theme found for themeId: ${themeId}`
    logger.error(msg, { data: { availableThemes: availableThemes.map(t => t.themeId) } })
    throw new Error(msg)
  }

  const site = await theme.toSite({ fictionSites, subDomain, siteId, orgId, siteRouter, siteMode, isStatic: true, org })

  return site
}

export async function loadSiteFromCard(args: { cardId: string, siteRouter: FictionRouter, fictionSites: FictionSites, siteMode: SiteMode, caller?: string }): Promise<Site> {
  const { cardId } = args
  const normCardId = toCamel(cardId)
  const site = await loadSiteFromTheme({ ...args, themeId: 'base' })

  const { createDemoPage } = await import('./utils/demo.js')

  const templates = site.theme.value?.templates || []

  const template = templates.find(t => t.settings.templateId === normCardId)

  if (!template)
    throw new Error(`no template found for card ${normCardId}`)

  const demo = await createDemoPage({ site, template })
  const factory = new CardFactory({ templates, site, caller: 'siteFromCard' })

  const page = await factory.fromTemplate({ ...demo, slug: '_home', isHome: true })

  await site.update({ pages: [page] }, { caller: 'loadSiteFromCard', noSave: true })

  return site
}

export async function loadSite(args: {
  fictionSites: FictionSites
  siteRouter: FictionRouter
  caller?: string
  mountContext?: MountContext
}) {
  const { siteRouter, fictionSites, caller = 'loadSite', mountContext } = args

  const vals = { caller, ...mountContext }

  let site: Site | undefined = undefined
  try {
    const { orgId, handle, siteId, subDomain, hostname, themeId, cardId, siteMode = 'standard', internal } = mountContext || {}

    const where = { siteId, subDomain, hostname, themeId, orgId, handle } as WhereSite
    const hasWhere = Object.values(where).filter(Boolean).length > 0

    const selectors = [siteId, subDomain, themeId, cardId, handle].filter(Boolean)

    if (selectors.length > 1)
      logger.error('Multiple selectors used to load site', { data: { selectors } })

    // for health checks, etc.
    if (internal)
      return

    if (themeId) {
      site = await loadSiteFromTheme({ themeId, siteRouter, fictionSites, siteMode, caller })
      logger.debug(`loading site from theme (${themeId})`, { data: { themeId, site: site.toConfig() } })
    }
    else if (cardId) {
      logger.debug('Loading site from card template', { data: { cardId } })
      site = await loadSiteFromCard({ cardId, siteRouter, fictionSites, siteMode, caller })
    }
    else if (hasWhere) {
      logger.debug('Loading site with Selector', {
        data: { ...(subDomain && { subDomain }), ...(siteId && { siteId }), ...(themeId && { themeId }), vals },
      })

      site = await loadSiteById({ where, siteRouter, fictionSites, siteMode, caller })
    }
    else {
      const data = { vals, siteRouter: siteRouter.toConfig(), caller }
      logger.error('LOAD: no siteId, subDomain, or themeId', { data })
    }
  }
  catch (error) {
    logger.error('Error loading site', { error })
  }

  if (!site)
    logger.debug('No Site Loaded', { data: { vals } })

  return site
}

export function domainMountContext({ runVars }: { runVars: Partial<RunVars> }): MountContext {
  const { HOSTNAME = '', ORIGINAL_HOST } = runVars

  const specialDomains = ['lan.', 'fiction.', 'fictionsites.']
  const isSpecialSubDomain = specialDomains.some(prefix => HOSTNAME.includes(prefix))
  const isSpecialOriginalHost = specialDomains.some(prefix => ORIGINAL_HOST?.includes(prefix))
  const subDomain = HOSTNAME.split('.')[0]
  const effectiveSubdomain = isSpecialSubDomain ? subDomain : isSpecialOriginalHost ? ORIGINAL_HOST?.split('.')[0] : ''

  if (!effectiveSubdomain) {
    const ipRegex = /^(?:\d{1,3}\.){3}\d{1,3}$/ // Regex to check if the hostname is an IP address

    // Return empty if HOSTNAME is an IP address
    if (ipRegex.test(HOSTNAME) || HOSTNAME === 'localhost' || HOSTNAME.includes('fly.dev'))
      return { internal: HOSTNAME }

    return { hostname: HOSTNAME }
  }

  const themePrefix = 'theme-'
  if (effectiveSubdomain.startsWith(themePrefix))
    return { themeId: effectiveSubdomain.substring(themePrefix.length) }

  const stagePrefix = 'stage-'
  if (effectiveSubdomain.startsWith(stagePrefix))
    return { handle: effectiveSubdomain.substring(stagePrefix.length) }

  return { subDomain: effectiveSubdomain }
}

export function getMountContext(args: {
  selectorType?: string | undefined
  selectorId?: string | undefined
  queryVars?: Record<string, string | undefined>
  siteMode?: SiteMode
  runVars?: Partial<RunVars>
  siteId?: string
  orgId?: string
  caller?: string
}): MountContext {
  const { selectorType, selectorId, queryVars = {}, runVars, orgId, caller } = args

  const mountContext = runVars?.MOUNT_CONTEXT

  let selector: Partial<MountContext> = {}
  let siteMode = args.siteMode || 'standard'

  // Premade mount context as passed in mount, used in preview and editing
  if (mountContext) {
    const mc = mountContext as MountContext
    selector = {
      cardId: mc.cardId,
      siteId: mc.siteId,
      themeId: mc.themeId,
      subDomain: mc.subDomain,
      hostname: mc.hostname,
      orgId: mc.orgId,
      handle: mc.handle,
    }
    siteMode = mc.siteMode || siteMode
  }
  else {
    // Used to make the context in app, preview passes the result back to this function
    // loaded using route params /:selectorType/:selectorId
    if (selectorType) {
      selector = {
        cardId: selectorType === 'card' ? selectorId : undefined,
        siteId: selectorType === 'site' ? selectorId : undefined,
        themeId: selectorType === 'theme' ? selectorId : undefined,
        subDomain: selectorType === 'domain' ? selectorId : undefined,
        hostname: selectorType === 'hostname' ? selectorId : undefined,
        orgId: selectorType === 'org' ? selectorId : undefined,
        handle: selectorType === 'handle' ? selectorId : undefined,
      }
    }

    // loaded using query params ?siteId=123, or manual record passed
    else if (queryVars && Object.values(queryVars).filter(Boolean).length > 0) {
      selector = {
        cardId: queryVars.cardId || undefined,
        siteId: queryVars.siteId || undefined,
        themeId: queryVars.themeId || undefined,
        subDomain: queryVars.subDomain || undefined,
        hostname: queryVars.hostname || undefined,
        orgId: queryVars.orgId || undefined,
        handle: queryVars.handle || undefined,
      }
    }

    // otherwise use current subdomain
    else if (runVars && Object.values(selector).filter(Boolean).length === 0) {
      selector = domainMountContext({ runVars })
    }
  }

  const numVals = Object.values(selector).filter(Boolean).length

  if (numVals === 0 && orgId) {
    selector = { orgId }
  }
  else if (numVals !== 1) {
    logger.error('MountContext: INVALID SELECTOR', { data: { orgId, numVals, caller, selector, queryVars, selectorType, selectorId, siteMode, runVars, passedMountContext: mountContext } })

    const errorMessage = 'MountContext Error'
    throw new Error(errorMessage)
  }

  const contextCacheKey = Object.entries(selector).filter(o => o[1]).map(([key, value]) => `${key}:${value}`).join('-')

  return { siteMode, contextCacheKey, ...selector } as MountContext
}

function formatPath(basePath: string, path: string): string {
  const out = `${basePath}${path}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '')
  return out || '/'
}

export type SiteContentPath = {
  path: string
  type: 'post' | 'page' | 'item'
  meta?: Record<string, any>
}

export async function getSiteContentPaths(site: Site): Promise<SiteContentPath[]> {
  if (!site?.pages?.value)
    return []

  const pagePathPromises = site.pages.value
    .filter(page => page.slug.value && page.slug.value !== '_404' && !page.slug.value.startsWith('__'))
    .map(async (page) => {
      const pagePath = page.isHome.value ? '/' : `/${page.slug.value}`
      const viewPath = pagePath === '/' ? '/_' : pagePath

      const cardPathPromises = page.cards.value
        .filter(card => card.tpl.value?.settings.getContentPaths)
        .map(async card => card.tpl.value?.settings.getContentPaths?.({ site, card, viewPath }) || [])

      const cardPaths = (await Promise.all(cardPathPromises)).flat()

      return [
        { type: 'page' as const, path: pagePath },
        ...cardPaths,
      ]
    })

  const allPaths = (await Promise.all(pagePathPromises)).flat()

  return allPaths
}

export async function getSitemapPathsFromSite(site: Site, basePath: string = ''): Promise<string[]> {
  if (!site?.pages?.value)
    return []

  const contentPaths = await getSiteContentPaths(site)
  return contentPaths.map(contentPath => formatPath(basePath, contentPath.path))
}

export async function loadSitemap(args: { mode: 'static' | 'dynamic', runVars?: Partial<RunVars>, fictionRouter: FictionRouter, fictionSites: FictionSites }): Promise<{ hostname: string, paths: string[] }> {
  const { runVars, fictionRouter, fictionSites, mode } = args

  if (mode === 'static') {
    const routes = fictionRouter.routes.value
    const routesWithThemeId = routes.filter(r => r.settings.props?.themeId && !r.settings.noSitemap).map((r) => {
      const basePath = r.settings.path.split('/:viewId')[0]
      const out = { basePath: basePath || '/', themeId: r.settings.props?.themeId }

      return out
    })

    const themeSites = await Promise.all(routesWithThemeId.map(async ({ basePath, themeId }) => {
      const site = await loadSiteFromTheme({ themeId, siteRouter: fictionRouter, fictionSites, siteMode: 'designer', caller: 'loadSitemap' })
      return { site, basePath }
    }))

    const pathPromises = themeSites.map(async ({ site, basePath }) => getSitemapPathsFromSite(site, basePath))

    const pathLists = await Promise.all(pathPromises)

    const paths = pathLists.flat()

    return { hostname: fictionRouter.baseUrl, paths }
  }
  else {
    const mountContext = getMountContext({ runVars, caller: 'loadSitemap' })
    const site = await loadSite({ ...args, siteRouter: fictionRouter, mountContext })

    if (!site)
      return { hostname: '', paths: [] }

    const paths = await getSitemapPathsFromSite(site)
    return { hostname: runVars?.HOSTNAME || '', paths }
  }
}
