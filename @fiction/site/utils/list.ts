import type { NavListItem } from '@fiction/core'
import type { Card, Site } from '..'
import { siteLink } from './manage.js'

export type SiteListItem = NavListItem & {
  stagingUrl: string
}

export function getSiteIndexItemList(sites: Site[], parentCard: Card): SiteListItem[] {
  if (!sites || !sites.length)
    return []

  const fictionAppSites = parentCard.site?.fictionSites.settings.fictionAppSites

  if (!fictionAppSites) {
    throw new Error('parentCard missing site')
  }

  const rows = sites.map((site) => {

    const editLink = siteLink({ site: parentCard.site, location: { path: '/edit-site', query: { siteId: site.settings.siteId } } })
    const out: SiteListItem = {
      label: site.settings.title || 'Untitled',
      description: site.settings.isPrimary ? 'Primary site' : 'Development site',
      key: site.settings.siteId,
      href: editLink,
      // figure: { el: vue.defineAsyncComponent(() => import('./fig/FigSite.vue')), props: { site } },
      dateAt: site.settings.updatedAt,
      icon: { class: 'i-tabler-browser' },
      stagingUrl: site.frame.currentSiteFrameUrl.value,
    }

    return out
  })

  return rows
}
