import type { IndexItem } from '@fiction/core'
import { siteLink } from '../utils/manage.js'
import type { Card, Site } from '..'

export function getSiteIndexItemList(sites: Site[], parentCard: Card): IndexItem[] {
  if (!sites || !sites.length)
    return []

  const fictionAppSites = parentCard.site?.fictionSites.settings.fictionAppSites

  if (!fictionAppSites) {
    throw new Error('parentCard missing site')
  }

  const rows = sites.map((site) => {
    const domain = site.primaryCustomDomain.value || fictionAppSites.liveUrl.value.replace('*', site.settings.subDomain || '')
    const displayDomain = domain.replace('https://', '').replace('http://', '').replace('www.', '')
    const editLink = siteLink({ site: parentCard.site, location: { path: '/edit-site', query: { siteId: site.settings.siteId } } })
    const out: IndexItem = {
      name: site.settings.title || 'Untitled',
      desc: `${displayDomain}`,
      key: site.settings.siteId,
      href: editLink,
      // figure: { el: vue.defineAsyncComponent(() => import('./fig/FigSite.vue')), props: { site } },
      dateIso: site.settings.updatedAt,
      icon: 'i-tabler-browser',
    }

    return out
  })

  return rows
}
