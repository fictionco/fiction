import type { IndexMeta, IndexQuery, vueRouter } from '@fiction/core'
import { Site } from '../site.js'
import type { FictionSites } from '../index.js'

export type ManageIndexParamsRequest = {
  _action: 'delete' | 'list'
  selectedIds?: string[]
  loadDraft?: boolean
} & IndexQuery

export async function manageSiteIndex(args: { fictionSites: FictionSites, params: ManageIndexParamsRequest }): Promise<{ sites: Site[], indexMeta?: IndexMeta }> {
  const { fictionSites, params } = args

  const r = await fictionSites.requests.ManageSites.projectRequest(params)

  const siteRouter = fictionSites.settings.fictionRouterSites || fictionSites.settings.fictionRouter
  const sitePromises = r.data ? r.data.map(async d => Site.create({ ...d, fictionSites, siteRouter, isEditable: false })) : []

  const sites = await Promise.all(sitePromises)

  return { sites, indexMeta: r.indexMeta }
}

export function siteLink(args: { site?: Site, location: vueRouter.RouteLocationRaw, caller?: string }) {
  const { site, location } = args

  if (typeof location === 'string' && location.includes('http')) {
    return location
  }

  const router = site?.siteRouter.router.value
  if (!router) {
    console.error('siteLink - No router')
    return ''
  }
  const base = router.options.history.base
  const matched = router.currentRoute.value.matched
  const matchedRoute = matched[0]
  const matchedPath = matchedRoute.path
  if (!matchedRoute) {
    site.fictionSites.log.error('no matched current route', { data: { matched: router.currentRoute.value } })
    throw new Error('Card.link - No matched current route')
  }

  const viewId = router.currentRoute.value.params.viewId as string | undefined || ''
  const prefix = matchedPath.match(/.*?(?=\/:viewId|$)/)?.[0] || ''
  const resolvedHref = router.resolve(location).href
  const locationPath = resolvedHref.replace(base, '')

  const resolvedPath = locationPath.startsWith(prefix) ? locationPath : `${prefix}${locationPath}`

  const finalHref = resolvedPath.replace(/:viewId/g, viewId).replace(/([^:]\/)\/+/g, '$1')

  return finalHref
}

export async function siteGoto(args: { site?: Site, location: vueRouter.RouteLocationRaw, options: { replace?: boolean, caller?: string, retainQueryVars?: boolean } }) {
  const { site, location, options: { replace, caller = 'site:goto', retainQueryVars = false } } = args

  if (!site)
    return

  const router = site.siteRouter
  const method = replace ? 'replace' : 'push'

  const currentQuery = (router.query.value || {}) as Record<string, string >
  const targetHref = siteLink({ site, location })
  const url = new URL(targetHref, 'http://dummybase.com')
  const sp = url.searchParams

  if (retainQueryVars) {
    Object.keys(currentQuery).forEach((key) => {
      if (!sp.has(key)) {
        sp.set(key, currentQuery[key])
      }
    })
  }

  const finalPath = url.pathname + url.search + url.hash

  const result = await site.siteRouter[method](finalPath, { caller })

  return result
}
