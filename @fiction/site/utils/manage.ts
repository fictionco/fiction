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

  const r = await fictionSites.requests.ManageIndex.projectRequest(params)

  const siteRouter = fictionSites.settings.fictionRouterSites || fictionSites.settings.fictionRouter
  const sites = r.data ? r.data.map(d => new Site({ ...d, fictionSites, siteRouter, isEditable: false })) : []

  return { sites, indexMeta: r.indexMeta }
}

export function siteLink(args: { site?: Site, location: vueRouter.RouteLocationRaw }) {
  const { site, location } = args
  const router = site?.siteRouter.router.value
  if (!router) {
    console.error('siteLink - No router')
    return ''
  }

  const matchedRoute = router.currentRoute.value.matched[0]
  if (!matchedRoute)
    throw new Error('Card.link - No matched current route')

  const prefix = matchedRoute.path.match(/.*?(?=\/:viewId|$)/)?.[0] || ''
  const resolvedHref = router.resolve(location).href
  const finalHref = (resolvedHref.startsWith(prefix) ? resolvedHref : `${prefix}${resolvedHref}`)
    .replace(/:viewId/g, router.currentRoute.value.params.viewId as string | undefined || '')

  return finalHref.replace(/([^:]\/)\/+/g, '$1')
}

export function siteGoto(args: { site?: Site, location: vueRouter.RouteLocationRaw, options: { replace?: boolean, caller?: string } }) {
  const { site, location, options: { replace, caller = 'site:goto' } } = args
  const method = replace ? 'replace' : 'push'

  if (!site)
    return

  return site.siteRouter[method](siteLink({ site, location }), { caller })
}
