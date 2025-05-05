<script lang="ts" setup>
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionRouter } from '@fiction/core'
import type { FictionSites, TableSiteConfig } from '@fiction/site'
import type { FramePostMessageList } from '@fiction/site/utils/frame'
import { getColorScheme, log, simpleHandlebarsParser, toLabel, unhead, useService, vue } from '@fiction/core'
import { useSSRData } from '@fiction/core/utils/ssr'
import { Site, SITE_INJECTION_KEY } from '@fiction/site'
import { getMountContext, loadSite } from '@fiction/site/load'
import { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import NotifyToaster from '@fiction/ui/notify/NotifyToaster.vue'
import El404 from '@fiction/ui/page/El404.vue'
import { getHeadScripts } from './utils/head'
import { getHeadIconConfig } from './utils/icon'

const props = defineProps({
  themeId: { type: String, default: undefined },
  siteId: { type: String, default: undefined },
  orgId: { type: String, default: undefined },
  siteRouter: { type: Object as vue.PropType<FictionRouter>, default: undefined },
})

const logger = log.contextLogger('CardSite.vue')

const service = useService<{
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
  fictionAnalytics: FictionAnalytics
}>()

const { fictionSites, fictionRouter, runVars, fictionRouterSites, fictionUser, fictionEnv } = service

const siteRouter = props.siteRouter || fictionRouterSites || fictionRouter

let cleanups: (() => any)[] = []

const mountContext = vue.computed(() => {
  const { orgId = props.orgId, siteId = props.siteId, themeId = props.themeId } = fictionRouter.params.value as Record<string, string>
  const out = getMountContext({ queryVars: { themeId }, runVars, siteId, orgId, caller: 'CardSite' })

  return out
})

async function load() {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : `ssr:${runVars?.PATHNAME}`

  try {
    const s = await loadSite({
      siteRouter,
      fictionSites,
      mountContext: mountContext.value,
      caller: `CardSite-loadSite(${props.themeId || 'no-theme-id'}):${currentUrl}:HEADERS${runVars?.ALL_HEADERS}`,
    })

    return s
  }
  catch (error) {
    logger.error(`Error loading site ${(error as Error).message}`, { error })
  }
}

// Use the SSR data hook
const { data: site, loading, hasInitialized } = useSSRData({
  key: vue.computed(() => `site-${mountContext.value.contextCacheKey}`),
  fetchData: load,
  transform: {
    prepare: (site) => {
      return site?.toConfig() as TableSiteConfig | undefined
    },
    unpack: async (siteConfig) => {
      if (siteConfig) {
        const { siteMode } = mountContext.value
        const s = await Site.create({ ...siteConfig, fictionSites, siteRouter, siteMode })

        return s
      }
    },
  },
})

vue.provide(SITE_INJECTION_KEY, site)

const fonts = vue.computed(() => site.value?.siteFonts.value)

const page = vue.computed(() => site.value?.currentPage.value)
const pageConfig = vue.computed(() => page.value?.fullConfig.value || {})
const siteConfig = vue.computed(() => site.value?.fullConfig.value || {})

const org = vue.computed(() => site.value?.org.value)

function getTitleTag() {
  const seoConfig = page.value?.userConfig.value.standard
  if (seoConfig?.title)
    return seoConfig.title

  const titleTemplate = siteConfig.value.titleTemplate || '{{pageTitle}}'
  const siteTitle = org.value?.orgName || ''
  const pageTitle = page.value?.title?.value || toLabel(page.value?.slug?.value) || ''

  return simpleHandlebarsParser(titleTemplate, { pageTitle, siteTitle })
}

const iconUrls = vue.computed(() => getHeadIconConfig({ org: org.value }))

const colors = vue.computed(() => {
  const primaryColor = org.value?.primaryColor || 'blue'
  const themeColor = 'gray'

  return {
    primary: getColorScheme(primaryColor),
    primaryHex: getColorScheme(primaryColor, { outputFormat: 'hex' }),
    theme: getColorScheme(themeColor),
    themeHex: getColorScheme(themeColor, { outputFormat: 'hex' }),
  }
})

unhead.useHead({
  htmlAttrs: { lang: 'en', dir: 'ltr' },
  title: () => getTitleTag(),
  meta: [
    { charset: 'UTF-8' },
    { name: 'generator', content: 'Fiction.com' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'description', content: () => pageConfig.value.standard?.description || page.value?.description.value || '' },
    { name: 'robots', content: () => siteConfig.value?.robotsTxt || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'theme-color', content: () => colors.value.themeHex[900] },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: getTitleTag },
    { property: 'og:url', content: () => site.value?.url.value },
    { property: 'og:site_name', content: () => site.value?.title.value || '' },
    { property: 'og:locale', content: () => siteConfig.value?.locale || 'en_US' },
    { property: 'og:image', content: () => siteConfig.value?.shareImage?.url || iconUrls.value.ogImageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
  ],
  link: [
    {
      rel: 'shortcut icon',
      href: () => iconUrls.value.faviconUrl,
      type: () => iconUrls.value.faviconType,
      sizes: () => iconUrls.value.faviconType === 'svg' ? 'any' : '',
    },

    { rel: 'alternate icon', href: () => iconUrls.value.appleTouchIconUrl },
    { rel: 'mask-icon', href: () => iconUrls.value.faviconUrl, color: () => colors.value.themeHex['900'] },
    { rel: 'apple-touch-icon', sizes: '180x180', href: () => iconUrls.value.appleTouchIconUrl },
    { rel: 'icon', sizes: '32x32', href: () => iconUrls.value.appleTouchIconUrl },
    { rel: 'icon', sizes: '16x16', href: () => iconUrls.value.appleTouchIconUrl },
    { rel: 'canonical', href: () => site.value?.url.value },
    { key: 'font-pre', rel: 'preconnect ', href: 'https://fonts.googleapis.com' },
    { key: 'font-static', rel: 'preconnect ', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { key: 'font', rel: 'stylesheet', href: () => fonts.value?.fontsUrl, id: 'font-link' },
  ],
  script: () => getHeadScripts({ site: site.value }),
  style: [
    {
      innerHTML: 'html { opacity: 0; transform: scale(.96); transition: opacity 0.7s, transform 0.7s ease; } body.dark { background: #000; }',
    },
  ],
  noscript: () => getHeadScripts({ site: site.value, noscript: true }),
})

vue.watch(
  () => site?.value,
  () => {
    if (typeof window === 'undefined' || !site?.value)
      return

    if (site.value && site.value.siteMode.value === 'editable') {
      const util = new FrameUtility<FramePostMessageList>({
        relation: 'child',
        onMessage: (msg) => {
          if (!site.value)
            throw new Error('FrameUtility: Site not found')

          site.value.frame.processFrameMessage({ msg: msg as FramePostMessageList, scope: 'child' })
        },
      })
      util.init()
      site.value.frame.setUtil(util)
    }

    fictionSites.trackWebsiteEvents({ site: site.value })
  },
  { immediate: true },
)

vue.onMounted(async () => {
  unhead.useHead({
    bodyAttrs: { class: () => 'dark' },
  })
})

fictionEnv.events.on('cleanup', () => {
  cleanups.forEach(c => c && c())
  site.value?.cleanup()
  site.value = undefined
  cleanups = []
})

vue.onMounted(async () => {
  vue.watchEffect(() => {
    if (typeof document === 'undefined')
      return

    const clr = colors.value
    const th = clr.theme
    const prm = clr.primary
    const fn = fonts.value
    Object.entries(th).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--theme-${k}`, v)
    })
    Object.entries(prm).forEach(([k, v]) => {
      document.documentElement.style.setProperty(`--primary-${k}`, v)
    })

    const stacks = fn?.stacks || {}
    const fontsUrl = fn?.fontsUrl || ''
    for (const stack in stacks) {
      const stackFonts = (stacks[stack] || '').replaceAll('+', ' ')
      document.documentElement.style.setProperty(`--font-family-${stack}`, stackFonts)
    }

    // Update Google Fonts link
    const fontLink = document.getElementById('font-link') as HTMLLinkElement
    if (fontLink && fontsUrl) {
      fontLink.href = fontsUrl
    }
  })
})
</script>

<template>
  <div
    :data-page-template-id="site?.currentPage.value.templateId.value ?? '-'"
    :data-site-mode="site?.siteMode.value ?? '-'"
    :data-pathname="site?.currentPath.value ?? '-'"
    :data-view-id="site?.currentViewId.value ?? '-'"
    :data-page-id="site?.activePageId.value ?? '-'"
    :data-theme-id="site?.themeId.value ?? '-'"
    :data-sub-domain="site?.subDomain.value ?? '-'"
    :data-site-id="site?.siteId ?? '-'"
    :data-user-email="fictionUser.activeUser.value?.email ?? '-'"
    :data-fiction-router-id="site?.siteRouter.routerId ?? '-'"
    class="x-site bg-theme-50 dark:bg-theme-900 text-theme-800 dark:text-theme-0 antialiased"
  >
    <div class="x-font-body x-site-content relative z-10 bg-theme-0 dark:bg-theme-950">
      <div
        class="x-engine"
      >
        <div v-if="loading || !hasInitialized" class="text-theme-200 dark:text-theme-700 flex justify-center pt-32">
          <ElSpinner class="size-4" />
        </div>

        <template v-else-if="site">
          <component
            :is="site.currentPage.value.tpl.value?.settings.el"
            class="x-site-card min-h-[100vh] flex flex-col"
            :card="site.currentPage.value"
            :params="fictionRouter.params.value"
          />
        </template>
        <template v-else>
          <div class="h-dvh w-full grid min-h-full place-items-center bg-theme-900 text-white px-6 py-24 sm:py-32 lg:px-8">
            <El404
              :super-title="{ text: '404' }"
              title="No Site Available"
              sub-title="Nothing was found at this URL. Please check back later."
            />
          </div>
        </template>
      </div>
    </div>
    <NotifyToaster />
  </div>
</template>

<style lang="less">
@import url('@fiction/ui/entry.less');

html,
body,
#app,
.x-site,
.x-engine{
  min-height: 100dvh;
}

// can't be on root do to variables
.x-site{
  .x-font-title {
    font-family: var(--font-family-title, unset);
    // &.font-semibold {
    //   font-weight: var(--font-weight-title, 600);
    // }
    // &.font-bold {
    //   font-weight: var(--font-weight-title, 700);
    // }
    // &.font-light {
    //   font-weight: var(--font-weight-title, 300);
    // }
    // &.font-normal {
    //   font-weight: var(--font-weight-title, 400);
    // }
    // &.font-medium {
    //   font-weight: var(--font-weight-title, 500);
    // }
  }
  .x-font-highlight {
    font-family: var(--font-family-highlight, unset);
  }

  .x-font-body {
    font-family: var(--font-family-body, unset);
  }
  .x-font-input {
    font-family: var(--font-family-input, unset);
  }
  .x-font-mono {
    font-family: var(--font-family-mono, unset);
  }
  .x-font-sans {
    font-family: var(--font-family-sans, unset);
  }

}

/* Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>
