import { vue } from '@fiction/core'
import type { Site, SiteSettings } from '..'
import type { CardConfigPortable, TableSiteConfig } from '../tables'
import { Card } from '../card'
import { setPages } from './page'

export function setSections(args: { site: Site, sections?: Record<string, CardConfigPortable> }) {
  const { site, sections = {} } = args

  // Access theme and page template sections
  const themeSections = site.theme.value?.settings.sections || {}
  const pageTemplateSections = site.pages.value.reduce((acc, page) => {
    const pageSections = page.tpl.value?.settings.sections || {}
    return { ...acc, ...pageSections }
  }, {} as Record<string, CardConfigPortable>)

  // Unified all section IDs including page template sections
  const allSectionIds = [...new Set([
    ...Object.keys(themeSections),
    ...Object.keys(sections),
    ...Object.keys(pageTemplateSections),
  ])]

  return allSectionIds.reduce((acc, sectionId) => {
    // scope is set by the original source of the section
    const scope = pageTemplateSections[sectionId] ? 'template' : 'site'

    const config = sections[sectionId] || themeSections[sectionId] || pageTemplateSections[sectionId] || {}

    acc[sectionId] = new Card({ ...config, regionId: sectionId, site, scope })
    return acc
  }, {} as Record<string, Card>)
}

export async function saveSite(args: {
  site: Site
  onlyKeys?: (keyof TableSiteConfig)[]
  delayUntilSaveConfig?: Partial<TableSiteConfig>
  successMessage: string
  isPublishingDomains?: boolean
}) {
  const { site, onlyKeys, delayUntilSaveConfig, successMessage, isPublishingDomains } = args

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

  const r = await site.settings.fictionSites.requests.ManageSite.projectRequest({
    _action: 'update',
    fields,
    where: { siteId: config.siteId },
    successMessage,
    isPublishingDomains,
  })

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

  const { editor, pages, sections } = newConfig

  if (editor)
    site.editor.value = { ...site.editor.value, ...editor }

  if (pages)
    site.pages.value = setPages({ site, pages })

  if (sections)
    site.sections.value = setSections({ site, sections })

  return site
}

export function activeSiteHostname(site: Site, opts: { isProd?: boolean } = {}) {
  return vue.computed(() => {
    const isProd = opts.isProd ?? site.isProd.value
    const sub = site.subDomain.value || 'NO_SUB_DOMAIN'
    const app = site.fictionSites.settings.fictionAppSites
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

export function activeSiteDisplayUrl(site: Site, opts: { isProd?: boolean, mode: 'display' | 'staging' }) {
  return vue.computed(() => {
    const { mode, isProd = site.isProd.value } = opts
    const port = site.fictionSites.settings.fictionAppSites?.port

    if (site.primaryCustomDomain.value && mode === 'display') {
      return `https://${site.primaryCustomDomain.value}`
    }
    else {
      const hostname = activeSiteHostname(site).value
      const baseUrl = isProd ? `https://${hostname}` : `http://${hostname}:${port}`
      return baseUrl
    }
  })
}
