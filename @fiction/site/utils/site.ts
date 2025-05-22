import type { FictionSites, Site, SiteSettings } from '../index.js'
import type { CardConfigPortable, TableSiteConfig } from '../tables.js'
import { vue, waitFor } from '@fiction/core'
import { Card } from '../card.js'
import { t } from '../tables.js'
import { setPages } from './page.js'

// Define a type for the hooks to ensure type safety
export type QueryVarHook = {
  key: string
  callback: (args: { site: Site, value: string }) => Promise<void | { reload?: boolean }> | void | { reload?: boolean }
}

// This function encapsulates the watcher logic
export function setupRouteWatcher(args: {
  site: Site
  queryVarHooks: QueryVarHook[]
}): void {
  const { site, queryVarHooks } = args

  if (typeof window === 'undefined')
    return

  const fictionEnv = site.fictionSites.fictionEnv

  // Filter out hooks with duplicate keys and register new ones
  const uniqueHooks = queryVarHooks.filter((hook) => {
    if (site.registeredHookKeys.has(hook.key)) {
      return false
    }
    site.registeredHookKeys.add(hook.key)
    return true
  })

  // Only set up watcher if we have valid hooks
  if (!uniqueHooks.length)
    return

  const sw = vue.watch(
    () => site.siteRouter.current.value,
    async (route) => {
      if (!route)
        return

      const routeVars = { ...route.params, ...route.query } as Record<string, string | undefined>

      for (const hook of queryVarHooks) {
        const { key } = hook

        if (typeof routeVars[key] !== 'undefined') {
          // prevent clicks propagating and closing modals
          await waitFor(30)
          const result = await hook.callback({ site, value: decodeURIComponent(routeVars[key]) })
          // Create new query parameters excluding the current hook key
          const newQuery = { ...route.query }
          delete newQuery[key]
          await site.siteRouter.replace({
            path: route.path,
            query: newQuery,
            hash: route.hash,
          }, { caller: 'setupRouteWatcher:update' })

          if (result?.reload) {
            window.location.reload()
          }
        }
      }
    },
    { immediate: true },
  )

  fictionEnv.cleanupCallbacks.push(() => sw())
}

export function setSections(args: { site: Site, sections?: Record<string, CardConfigPortable>, themeSections?: Record<string, CardConfigPortable> }) {
  const { site, sections = {}, themeSections = {} } = args

  // get existing section config, note that on first time its setting sections to site.sections is missing
  const existingSections: Record<string, CardConfigPortable> = Object.fromEntries(Object.entries(site.sections?.value || {}).map(([k, v]) => [k, v.toConfig()]))

  // Access theme and page template sections

  const pageTemplateSections = site.pages.value.reduce((acc, page) => {
    const pageSections = page.tpl.value?.settings.sections || {}
    return { ...acc, ...pageSections }
  }, {} as Record<string, CardConfigPortable>)

  // Unified all section IDs including page template sections
  const allSectionIds = [...new Set(
    [existingSections, sections, themeSections, pageTemplateSections].flatMap(Object.keys),
  )]

  const out = allSectionIds.reduce((acc, sectionId) => {
    // scope is set by the original source of the section
    const scope = pageTemplateSections[sectionId] ? 'template' : 'site'

    const config = sections[sectionId] || existingSections[sectionId] || themeSections[sectionId] || pageTemplateSections[sectionId] || {}

    acc[sectionId] = new Card({ ...config, regionId: sectionId, site, scope })
    return acc
  }, {} as Record<string, Card>)

  return out
}

export async function localSiteConfig(args: { siteId: string, fields?: Partial<TableSiteConfig> }) {
  const { siteId, fields } = args
  if (typeof localStorage === 'undefined')
    return {}

  const k = `static-${siteId}`
  let conf = JSON.parse(localStorage.getItem(k) || '{}')

  if (fields) {
    conf = { ...conf, ...fields }
    localStorage.setItem(k, JSON.stringify(conf))
  }

  return conf
}

export async function saveSiteDraft(args: { site: Site, resetToPublished?: boolean }) {
  const { site } = args

  const config = site.toConfig()

  if (!config.siteId)
    throw new Error('no siteId')

  const fields: Partial<TableSiteConfig> = config

  const r = await site.settings.fictionSites.requests.ManageSite.projectRequest({
    _action: 'saveDraft',
    fields,
    where: { siteId: config.siteId },
    caller: 'saveSite',
  })

  site.saveUtil.clear()

  if (!r.data)
    throw new Error('no data returned from saveSiteDraft')

  return r.data
}

export async function saveSite(args: {
  site: Site
  scope?: 'draft' | 'publish'
  onlyKeys?: (keyof TableSiteConfig)[]
  delayUntilSaveConfig?: Partial<TableSiteConfig>
  successMessage: string
  isPublishingDomains?: boolean
  minTime?: number
}): Promise<Partial<TableSiteConfig>> {
  const { site, onlyKeys, delayUntilSaveConfig, successMessage, isPublishingDomains, minTime, scope = 'publish' } = args

  if (scope === 'draft') {
    site.editor.value.savedNeedsPublish = true
    return saveSiteDraft({ site })
  }

  site.editor.value = { ...site.editor.value, savedNeedsPublish: false }

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

  // save locally if coding as site doesn't exist
  if (site.settings.isStatic) {
    await waitFor(500)
    return localSiteConfig({ siteId: config.siteId, fields })
  }

  const r = await site.settings.fictionSites.requests.ManageSite.projectRequest({
    _action: 'update',
    fields,
    where: { siteId: config.siteId },
    successMessage,
    isPublishingDomains,
    caller: 'saveSite',
  }, { minTime })

  await updateSite({ site, newConfig: r.data || {}, caller: 'saveSite', noSave: true })

  site.saveUtil.clear()

  if (!r.data)
    throw new Error('no data returned from saveSite')

  return r.data
}

export async function updateSite(args: {
  site: Site
  newConfig: Partial<SiteSettings>
  caller?: string
  noSave?: boolean
  noSync?: boolean
  noHistory?: boolean
}) {
  const { site, newConfig, noSave = false, noSync = false, caller = 'updateSite' } = args
  if (!newConfig)
    return

  const availableKeys = ['title', 'userConfig', 'changeId', 'handle', 'customDomains', 'themeId', 'status', 'nav']
  const entries = Object.entries(newConfig).filter(([key]) => availableKeys.includes(key))

  entries.forEach(([key, value]) => {
    if (value !== undefined && vue.isRef(site[key as keyof typeof site]))
      (site[key as keyof typeof site] as vue.Ref).value = value
  })

  const { editor, pages, sections } = newConfig

  if (editor)
    site.editor.value = { ...site.editor.value, ...editor }

  if (pages) {
    site.pages.value = await setPages({ site, pages })
    site.sections.value = setSections({ site })
  }

  if (sections)
    site.sections.value = setSections({ site, sections })

  if (site.siteMode.value !== 'standard' && !noSync)
    site.syncChange({ caller, noSave })

  return site
}

export function scrollActiveCardIntoView(args: { site: Site, cardId: string }) {
  const { site, cardId } = args

  if (site.siteMode.value !== 'editable' || typeof document === 'undefined' || typeof window === 'undefined')
    return

  const element = document.getElementById(cardId)
  if (!element)
    return

  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight

  // Calculate the visible height of the element
  const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0)

  // Calculate the percentage of the element that's visible
  const visiblePercentage = (visibleHeight / rect.height) * 100

  const minPercent = rect.height > viewportHeight ? 0 : 40

  // If less than or equal to 20% is visible, scroll it into view
  if (visiblePercentage <= minPercent) {
    const scrollOptions: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'center',
    }

    // If the element is taller than the viewport, align to top instead of center
    if (rect.height > viewportHeight) {
      scrollOptions.block = 'start'
    }

    element.scrollIntoView(scrollOptions)
  }
}

export async function getSiteMetrics(args: { orgId: string, fictionSites: FictionSites }) {
  const { orgId, fictionSites } = args
  const db = fictionSites.settings.fictionDb.client()

  // Query to get totals from pages table
  const result = await db(t.pages)
    .where({ orgId })
    .select<{ totalWords: string, totalCards: string }[]>(
      db.raw('COALESCE(SUM(word_count), 0) as total_words'),
      db.raw('COALESCE(SUM(JSONB_ARRAY_LENGTH(cards)), 0) as total_cards'),
    )
    .first()

  return {
    totalWords: Number(result?.totalWords || 0),
    totalCards: Number(result?.totalCards || 0),
  }
}

export async function trackSiteMetrics(args: {
  orgId: string
  status?: 'published' | 'all'
  fictionSites: FictionSites
}) {
  const { orgId, fictionSites } = args
  const metrics = await getSiteMetrics({ orgId, fictionSites })

  const analytics = fictionSites.settings.fictionAnalytics

  await Promise.all([
    analytics?.track({
      orgId,
      event: 'contentTotalWordsSites',
      value: metrics.totalWords,
    }),
  ])

  return metrics
}
