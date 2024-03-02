import { vue } from '@fiction/core'
import type { Site, SiteSettings } from '..'
import type { TableSiteConfig } from '../tables'
import { Card } from '../card'
import { setPages } from './page'

/**
 * a computed handler for global site sections,
 * preferring stored site sections, then template sections, then theme sections
 */
export function activeMergedGlobalSections(args: { site: Site }) {
  const { site } = args
  return vue.computed({
    get: () => {
      // Simplified access to sections with direct fallbacks to empty objects
      const themeSections = site.theme.value?.settings.sections || {}
      const tplSections = site.currentPage.value.tpl.value?.settings.sections || {}
      const siteSections = site.siteSections.value || {}

      // Unified all section IDs in a concise manner
      const allSectionIds = [...new Set([...Object.keys(themeSections), ...Object.keys(tplSections), ...Object.keys(siteSections)])]

      // Directly construct the sections object without a separate selection function
      return allSectionIds.reduce((acc, sectionId) => {
        const config = siteSections[sectionId] || tplSections[sectionId] || themeSections[sectionId] || {}
        acc[sectionId] = new Card({ ...config, regionId: sectionId, site, parentId: site.currentPage.value.cardId })
        return acc
      }, {} as Record<string, Card>)
    },
    set: v => site.siteSections.value = { ...site.siteSections.value, ...Object.fromEntries(Object.entries(v).map(([k, v]) => [k, v.toConfig()])) },
  })
}

export async function saveSite(args: { site: Site, onlyKeys?: (keyof TableSiteConfig)[], delayUntilSaveConfig?: Partial<TableSiteConfig> }) {
  const { site, onlyKeys, delayUntilSaveConfig } = args

  const config = site.toConfig()

  if (!config.siteId)
    throw new Error('no siteId')

  let fields: Partial<TableSiteConfig> = { siteId: config.siteId }
  if (!onlyKeys)
    fields = config

  else
    onlyKeys.forEach(<T extends keyof TableSiteConfig>(key: T) => (fields[key] = config[key]))

  if (delayUntilSaveConfig)
    fields = { ...fields, ...delayUntilSaveConfig }

  const r = await site.settings.fictionSites.requests.ManageSite.projectRequest({ _action: 'update', fields, where: { siteId: config.siteId } })

  updateSite({ site, newConfig: r.data || {} })

  return r.data
}

export function updateSite(args: { site: Site, newConfig: Partial<SiteSettings> }) {
  const { site, newConfig } = args
  if (!newConfig)
    return
  const availableKeys = ['title', 'userConfig', 'changeId', 'subDomain', 'customDomains', 'themeId', 'status']
  const entries = Object.entries(newConfig).filter(([key]) => availableKeys.includes(key))

  entries.forEach(([key, value]) => {
    if (value !== undefined && vue.isRef(site[key as keyof typeof site]))
      (site[key as keyof typeof site] as vue.Ref).value = value
  })

  if (newConfig.editor)
    site.editor.value = { ...site.editor.value, ...newConfig.editor }

  if (newConfig.pages)
    site.pages.value = setPages({ site, pages: newConfig.pages })

  return site
}

export function activeSiteHostname(site: Site) {
  return vue.computed(() => {
    const sub = site.subDomain.value || 'NO_SUB_DOMAIN'
    const app = site.fictionSites.settings.fictionAppSites
    const isProd = site.isProd.value
    const base = isProd ? app?.liveUrl.value : app?.localUrl

    if (isProd && !base.includes('*'))
      console.error(`liveUrl must include a wildcard (*) - ${base}`)

    const full = base.replace('*', sub)
    try {
      return full ? new URL(full).hostname : ''
    }
    catch (e) {
      console.error(`Invalid URL encountered in getSiteHostname: ${full}`)

      return ''
    }
  })
}
