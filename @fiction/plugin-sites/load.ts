import type { FictionRouter } from '@fiction/core'
import { log } from '@fiction/core'
import type { TableSiteConfig } from './tables'
import { Site } from '.'
import type { FictionSites } from '.'

const logger = log.contextLogger('siteLoader')

export type SiteMode = 'editor' | 'editable' | 'standard'
type MountContext = { siteMode?: SiteMode, siteId?: string, themeId?: string, subDomain?: string } & ({ siteId: string } | { themeId: string } | { subDomain: string })

type WhereSite = { siteId: string } | { subDomain: string }
type RequestManageSiteParams = { caller: string, siteRouter: FictionRouter, fictionSites: FictionSites, fields?: Partial<TableSiteConfig>, where?: WhereSite, siteMode: SiteMode }
  & (
    { _action: 'update', fields: Partial<TableSiteConfig>, where: WhereSite }
    | { _action: 'retrieve' | 'delete', where: WhereSite }
    | { _action: 'create', fields: Partial<TableSiteConfig> }
  )

export async function requestManageSite(args: RequestManageSiteParams) {
  const { _action, siteRouter, fictionSites, fields, where, siteMode } = args

  logger.info(`request manage site:${_action}`, { data: { fields, where } })

  if (_action === 'create') {
    const { fields } = args
    const { themeId } = fields
    if (!themeId)
      throw new Error('no themeId')
  }
  else if (['update', 'delete', 'retrieve'].includes(_action) && (!where || !Object.keys(where).length)) {
    logger.error(`REQUEST SITE WHERE -> no siteId or subDomain ${_action}`)
    return {}
  }

  const r = await fictionSites.requests.ManageSite.projectRequest({ _action, fields: fields || {}, where: where || {} }, { userOptional: _action === 'retrieve' })

  let site: Site | undefined = undefined
  if (r.data?.siteId)
    site = new Site({ ...r.data, fictionSites, siteRouter, siteMode })

  return { site, response: r }
}

export async function loadSiteById(args: {
  where: WhereSite
  siteRouter: FictionRouter
  fictionSites: FictionSites
  siteMode: SiteMode
}): Promise<Site | undefined> {
  const { where, siteRouter, fictionSites, siteMode } = args
  const { site } = await requestManageSite({ where, _action: 'retrieve', siteRouter, fictionSites, caller: 'loadSiteById', siteMode })

  return site
}

export async function loadSiteFromTheme(args: {
  themeId: string
  siteRouter: FictionRouter
  fictionSites: FictionSites
  siteMode: SiteMode
  caller?: string
}): Promise<Site> {
  const { themeId, siteRouter, fictionSites, siteMode, caller } = args
  const availableThemes = fictionSites.themes.value
  const theme = availableThemes.find(t => t.themeId === themeId)

  if (!theme) {
    const msg = `${caller}: no theme found for themeId: ${themeId}`
    logger.error(msg, { data: { availableThemes: availableThemes.map(t => t.themeId) } })
    throw new Error(msg)
  }

  const site = new Site({ fictionSites, ...theme.toSite(), siteRouter, siteMode, themeId })

  return site
}

export async function loadSite(args: {
  fictionSites: FictionSites
  siteRouter: FictionRouter
  caller?: string
  mountContext?: MountContext
}) {
  const { siteRouter, fictionSites, caller = 'unknown', mountContext } = args

  const vals = { ...args, ...mountContext }

  let site: Site | undefined = undefined
  try {
    const { siteId, subDomain, themeId, siteMode = 'standard' } = mountContext || {}

    const selectors = [siteId, subDomain, themeId].filter(Boolean)

    if (selectors.length > 1)
      logger.error('Multiple selectors used to load site', { data: { selectors } })

    logger.info('Loading site', {
      data: { ...(subDomain && { subDomain }), ...(siteId && { siteId }), ...(themeId && { themeId }), vals },
    })

    if (themeId) {
      logger.info('Loading site from theme', { data: { themeId } })
      site = await loadSiteFromTheme({ themeId, siteRouter, fictionSites, siteMode, caller: 'loadSite' })
    }
    else if (siteId || subDomain) {
      const where = siteId ? { siteId } : { subDomain } as { subDomain: string }

      site = await loadSiteById({ where, siteRouter, fictionSites, siteMode })

      logger.info('Loading Site Result', { data: site?.toConfig() })
    }
    else {
      const data = { vals, siteRouter: siteRouter.toConfig(), caller }
      logger.error('LOAD: no siteId, subDomain, or themeId', { data })
    }
  }
  catch (error) {
    logger.error('Error loading site', { error })
  }
  return site
}

export function subDomainMountContext(args: { subDomain: string }): MountContext {
  const { subDomain } = args

  const mountContext = {
    subDomain: subDomain !== 'www' && !subDomain.includes('theme-') ? subDomain : undefined,
    themeId: subDomain.includes('theme-') ? subDomain.replace('theme-', '') : undefined,
  }
  return mountContext as MountContext
}

export function getMountContext(args: {
  selectorType?: string | undefined
  selectorId?: string | undefined
  queryVars?: Record<string, string | undefined>
  mountContext?: Record<string, string>
  currentSubDomain?: string
  siteMode?: SiteMode
}): MountContext {
  const { selectorType, selectorId, queryVars = {}, mountContext, currentSubDomain } = args

  let selector: Partial<MountContext> = {}
  let siteMode = args.siteMode || 'standard'

  if (mountContext) {
    const mc = mountContext as MountContext
    selector = {
      siteId: mc.siteId,
      themeId: mc.themeId,
      subDomain: mc.subDomain,
    }
    siteMode = mc.siteMode || siteMode
  }
  else {
    // loaded using route params /:selectorType/:selectorId
    if (selectorType) {
      selector = {
        siteId: selectorType === 'site' ? selectorId : undefined,
        themeId: selectorType === 'theme' ? selectorId : undefined,
        subDomain: selectorType === 'domain' ? selectorId : undefined,
      }
    }

    // loaded using query params ?siteId=123, or manual record passed
    else if (queryVars && Object.values(queryVars).filter(Boolean).length > 0) {
      selector = {
        siteId: queryVars.siteId || undefined,
        themeId: queryVars.themeId || undefined,
        subDomain: queryVars.subDomain || undefined,
      }
    }

    // otherwise use current subdomain
    else if (currentSubDomain && Object.values(selector).filter(Boolean).length === 0) {
      selector = subDomainMountContext({ subDomain: currentSubDomain })
    }
  }

  if (Object.values(selector).filter(Boolean).length !== 1) {
    logger.error('MountContext: invalid selector', { data: { selector, queryVars, currentSubDomain, selectorType, selectorId, siteMode, passedMountContext: mountContext } })

    const errorMessage = currentSubDomain === 'www' ? 'WWW Subdomain' : 'MountContext Error'
    throw new Error(errorMessage)
  }

  return { siteMode, ...selector } as MountContext
}
