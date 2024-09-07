import { log } from '@fiction/core'
import type { FictionRouter, RunVars } from '@fiction/core'
import { createCard, Site } from './index.js'
import { localSiteConfig } from './utils/site.js'
import type { ManageSiteParams } from './endpoint.js'
import type { FictionSites, TableSiteConfig } from './index.js'

const logger = log.contextLogger('siteLoader')

/**
 * SiteMode establishes the context in which the site is being loaded.
 * - designer: the site is being loaded in the parent designer frame, editing another site in iframe
 * - editable: the site is in iframe and editable by the user
 * - standard: the site is being loaded in a standard context, not editable
 * - coding: the site is being loaded manually, and coded to run directly
 */
export type SiteMode = 'designer' | 'editable' | 'standard' | 'coding'
export type WhereSite = { siteId?: string, subDomain?: string, hostname?: string, themeId?: string, internal?: string, cardId?: string }
  & ({ siteId: string } | { subDomain: string } | { hostname: string } | { themeId: string } | { internal: string } | { cardId: string })

type MountContext = { siteMode?: SiteMode, fictionOrgId?: string, fictionSiteId?: string } & WhereSite
type RequestManageSiteParams = ManageSiteParams & { siteRouter: FictionRouter, fictionSites: FictionSites, siteMode: SiteMode, orgId?: string, siteId?: string }

export async function requestManageSite(args: RequestManageSiteParams) {
  const { _action, siteMode, caller = 'requestManageSite', fields, where } = args
  const { fictionSites, siteRouter, ...pass } = args

  logger.info(`request manage site:${_action}`, { data: { fields, where } })

  if (_action === 'create') {
    const { fields } = args
    const { themeId } = fields || {}
    if (!themeId)
      throw new Error('no themeId')
  }
  else if (['update', 'delete', 'retrieve'].includes(_action)) {
    const { _action, where } = args
    if (!where || !Object.keys(where).length) {
      logger.error(`REQUEST SITE WHERE -> no siteId or subDomain ${_action}`)
      return {}
    }
  }

  const r = await fictionSites.requests.ManageSite.projectRequest({ ...pass, caller, _action, fields: fields || {}, where: where as WhereSite }, { userOptional: _action === 'retrieve' })

  let site: Site | undefined = undefined
  if (r.data?.siteId)
    site = await Site.create({ ...r.data, fictionSites, siteRouter, siteMode })

  return { site, response: r }
}

export async function loadSiteById(args: { where: WhereSite, siteRouter: FictionRouter, fictionSites: FictionSites, siteMode: SiteMode, caller?: string }): Promise<Site | undefined> {
  const { where, siteRouter, fictionSites, siteMode, caller = 'loadSiteById' } = args
  const { site } = await requestManageSite({ where, _action: 'retrieve', siteRouter, fictionSites, caller, siteMode })

  return site
}

export async function loadSiteFromTheme(args: {
  fictionSiteId?: string
  fictionOrgId?: string
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
  const { fictionEnv } = fictionSites.settings
  const appMeta = fictionEnv.meta.app || {}
  const orgId = args.fictionOrgId || appMeta.orgId || fictionEnv.var('FICTION_ORG_ID')
  const siteId = args.fictionSiteId || appMeta.siteId || fictionEnv.var('FICTION_SITE_ID')

  if (!orgId) {
    throw new Error(`loadSiteFromTheme: orgId required (caller:${caller})`)
  }

  const subDomain = `theme-${themeId}`

  if (!theme) {
    const msg = `${caller}: no theme found for themeId: ${themeId}`
    logger.error(msg, { data: { availableThemes: availableThemes.map(t => t.themeId) } })
    throw new Error(msg)
  }
  const site = await theme.toSite({ fictionSites, subDomain, siteId, orgId, siteRouter, siteMode, isStatic: true })

  return site
}

export async function loadSiteFromCard(args: { cardId: string, siteRouter: FictionRouter, fictionSites: FictionSites, siteMode: SiteMode, caller?: string }): Promise<Site> {
  const { cardId } = args
  const siteId = `card-${cardId}`
  const site = await loadSiteFromTheme({ ...args, themeId: 'minimal', fictionSiteId: `card-${cardId}` })

  const templates = site.theme.value?.templates || []

  const tpl = templates.find(t => t.settings.templateId === cardId)

  if (!tpl)
    throw new Error(`no template found for card ${cardId}`)

  const card = await tpl.settings.demoPage?.({ site })

  // local stored config, useful for development
  const staticConfig = await localSiteConfig({ siteId })

  const cards = card?.cards || []

  site.update({ pages: [
    createCard({
      slug: '_home',
      cards: [
        {
          templateId: 'hero',
          userConfig: {
            superHeading: tpl.settings.category?.join(', '),
            heading: tpl.settings.title,
            subHeading: tpl.settings.description,
            actions: [],
            superColor: tpl.settings.colorTheme,
            superIcon: tpl.settings.icon,
          },
        },
        ...cards,
      ],

    }),
  ], ...staticConfig })

  return site
}

export async function loadSite(args: { fictionSites: FictionSites, siteRouter: FictionRouter, caller?: string, mountContext?: MountContext }) {
  const { siteRouter, fictionSites, caller = 'loadSite', mountContext } = args

  const vals = { caller, ...mountContext }

  let site: Site | undefined = undefined
  try {
    const { fictionOrgId, fictionSiteId, siteId, subDomain, hostname, themeId, cardId, siteMode = 'standard', internal } = mountContext || {}

    const where = { siteId, subDomain, hostname, themeId } as WhereSite

    const hasWhere = Object.values(where).filter(Boolean).length > 0

    const selectors = [siteId, subDomain, themeId, cardId].filter(Boolean)

    if (selectors.length > 1)
      logger.error('Multiple selectors used to load site', { data: { selectors } })

    // for health checks, etc.
    if (internal)
      return

    if (themeId) {
      site = await loadSiteFromTheme({ fictionOrgId, fictionSiteId, themeId, siteRouter, fictionSites, siteMode, caller })
      logger.debug('Loading site from theme', { data: { themeId, site } })
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
    logger.error('No Site Loaded', { data: { vals } })

  return site
}

export function domainMountContext({ runVars }: { runVars: Partial<RunVars> }): MountContext {
  const { HOSTNAME = '', ORIGINAL_HOST } = runVars

  const specialDomains = ['lan.', 'fiction.']
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
}): MountContext {
  const { selectorType, selectorId, queryVars = {}, runVars, siteId, orgId } = args

  const mountContext = runVars?.MOUNT_CONTEXT

  let selector: Partial<MountContext> = {}
  let siteMode = args.siteMode || 'standard'

  const fictionOrgId = orgId || runVars?.FICTION_ORG_ID
  const fictionSiteId = siteId || runVars?.FICTION_SITE_ID

  // Premade mount context as passed in mount, used in preview and editing
  if (mountContext) {
    const mc = mountContext as MountContext
    selector = {
      cardId: mc.cardId,
      siteId: mc.siteId,
      themeId: mc.themeId,
      subDomain: mc.subDomain,
      hostname: mc.hostname,
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
      }
    }

    // otherwise use current subdomain
    else if (runVars && Object.values(selector).filter(Boolean).length === 0) {
      selector = domainMountContext({ runVars })
    }
  }

  if (Object.values(selector).filter(Boolean).length !== 1) {
    logger.error('MountContext: INVALID SELECTOR', { data: { selector, queryVars, selectorType, selectorId, siteMode, passedMountContext: mountContext } })
    logger.error('MountContext: INVALID SELECTOR -- RUN VARS', { data: { runVars } })

    const errorMessage = 'MountContext Error'
    throw new Error(errorMessage)
  }

  return { siteMode, fictionOrgId, fictionSiteId, ...selector } as MountContext
}

function formatPath(basePath: string, path: string): string {
  const out = `${basePath}${path}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '')
  return out || '/'
}

export function getPathsFromSite(site: Site, basePath: string = ''): string[] {
  if (!site?.pages?.value)
    return []

  return site.pages.value.filter(page => page.slug.value && page.slug.value !== '_404').flatMap((page) => {
    const pagePath = page.slug.value === '_home' ? '/' : `/${page.slug.value}`
    const cardPaths = page.cards.value.filter(card => card.slug.value).map(card => `${pagePath}/${card.slug.value}`)

    return [pagePath, ...cardPaths]
  }).map(path => formatPath(basePath, path))
}

export async function loadSitemap(args: { mode: 'static' | 'dynamic', runVars?: Partial<RunVars>, fictionRouter: FictionRouter, fictionSites: FictionSites }): Promise<{ hostname: string, paths: string[] }> {
  const { runVars, fictionRouter, fictionSites, mode } = args

  if (mode === 'static') {
    const routes = fictionRouter.routes.value
    const routesWithThemeId = routes.filter(r => r.settings.props?.themeId && !r.settings.noSitemap).map((r) => {
      const basePath = r.settings.path.split('/:viewId')[0]
      const out = { basePath: basePath || '/', themeId: r.settings.props.themeId }

      return out
    })

    const themeSites = await Promise.all(routesWithThemeId.map(async ({ basePath, themeId }) => {
      const site = await loadSiteFromTheme({ themeId, siteRouter: fictionRouter, fictionSites, siteMode: 'designer', caller: 'loadSitemap' })
      return { site, basePath }
    }))

    const paths = themeSites.flatMap(({ site, basePath }) => getPathsFromSite(site, basePath))

    return { hostname: fictionRouter.baseUrl, paths }
  }
  else {
    const mountContext = getMountContext({ runVars })
    const site = await loadSite({ ...args, siteRouter: fictionRouter, mountContext })

    if (!site)
      return { hostname: '', paths: [] }

    const paths = getPathsFromSite(site)
    return { hostname: runVars?.HOSTNAME || '', paths }
  }
}
