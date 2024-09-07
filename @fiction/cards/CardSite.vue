<script lang="ts" setup>
import { getColorScheme, log, simpleHandlebarsParser, toLabel, unhead, useService, vue } from '@fiction/core'
import { getMountContext, loadSite } from '@fiction/site/load'
import { FrameUtility } from '@fiction/ui/frame/elBrowserFrameUtil'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import NotifyToaster from '@fiction/ui/notify/NotifyToaster.vue'
import El404 from '@fiction/ui/page/El404.vue'
import type { FictionAnalytics } from '@fiction/analytics'
import type { FictionRouter } from '@fiction/core'
import type { FictionSites, Site } from '@fiction/site'
import type { FramePostMessageList } from '@fiction/site/utils/frame'

const props = defineProps({
  themeId: { type: String, default: undefined },
  siteId: { type: String, default: undefined },
  orgId: { type: String, default: undefined },
  siteRouter: { type: Object as vue.PropType<FictionRouter>, default: undefined },
})

const logger = log.contextLogger('CardSite.vue')

const { fictionSites, fictionRouter, runVars, fictionRouterSites, fictionUser, fictionEnv } = useService<{
  fictionSites: FictionSites
  fictionRouterSites: FictionRouter
  fictionAnalytics: FictionAnalytics
}>()

const loading = vue.ref(false)
const site = vue.shallowRef<Site>()
const fonts = vue.computed(() => site.value?.siteFonts.value)
let cleanups: (() => any)[] = []
async function load() {
  loading.value = true

  const currentUrl = typeof window !== 'undefined' ? window.location.href : `ssr:${runVars?.PATHNAME}`

  const { orgId = props.orgId, siteId = props.siteId, themeId = props.themeId } = fictionRouter.params.value as Record<string, string>

  try {
    const mountContext = getMountContext({ queryVars: { themeId }, runVars, siteId, orgId })
    const siteRouter = props.siteRouter || fictionRouterSites || fictionRouter

    site.value = await loadSite({
      siteRouter,
      fictionSites,
      mountContext,
      caller: `CardSite-loadSite(${props.themeId || 'no-theme-id'}):${currentUrl}:HEADERS${runVars?.ALL_HEADERS}`,
    })
  }
  catch (error) {
    logger.error(`Error loading site ${(error as Error).message}`, { error })
  }
  finally {
    loading.value = false
  }
}

vue.onServerPrefetch(async () => {
  await load()
})

const page = vue.computed(() => site.value?.currentPage.value)

function getTitleTag() {
  const seoConfig = page.value?.userConfig.value.seo
  if (seoConfig?.title)
    return seoConfig.title

  const titleTemplate = site.value?.fullConfig.value?.seo?.titleTemplate || '{{pageTitle}}'
  const pageTitle = page.value?.title?.value || toLabel(page.value?.slug?.value) || 'Home'
  const siteTitle = site.value?.title?.value || 'Untitled Site'

  return simpleHandlebarsParser(titleTemplate, { pageTitle, siteTitle })
}

function getScript(args: { noscript?: boolean } = {}) {
  const { noscript } = args
  const gtmContainerId = site.value?.fullConfig.value.customCode?.gtmContainerId

  if (noscript) {
    return gtmContainerId
      ? [{ innerHTML: `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmContainerId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe>` }]
      : []
  }
  else {
    const script = [{
      innerHTML: 'document.addEventListener(\'DOMContentLoaded\', function() { document.documentElement.style.visibility = \'visible\'; });',
      type: 'text/javascript',
    }]

    if (gtmContainerId) {
      script.push({
        innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmContainerId}');`,
        type: 'text/javascript',
      })
    }

    return script
  }
}

const iconUrls = vue.computed(() => {
  const config = site.value?.fullConfig.value.branding || {}
  const faviconUrl = config.favicon?.url || ''
  const iconUrl = config.icon?.url || ''
  const faviconType = faviconUrl.split('.').pop()?.toLowerCase()

  return {
    faviconUrl,
    appleTouchIconUrl: iconUrl || faviconUrl,
    msTileIconUrl: iconUrl || faviconUrl,
    faviconType,
  }
})

unhead.useHead({
  htmlAttrs: { lang: 'en', dir: 'ltr' },
  title: () => getTitleTag(),
  meta: [
    { charset: 'UTF-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: `description`, content: () => (page.value?.userConfig.value.seo?.description || page.value?.description.value || '') },
    { name: 'robots', content: () => (site.value?.userConfig.value.seo?.robotsTxt || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1') },
    { property: 'og:site_name', content: () => site.value?.title.value || '' },
    { property: 'og:locale', content: () => site.value?.fullConfig.value.seo?.locale || 'en_US' },
    { property: 'og:image', content: () => site.value?.fullConfig.value.branding?.shareImage?.url || '' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: () => getTitleTag() },
    { property: 'og:url', content: () => site.value?.frame.displayUrl.value },
    { name: 'robots', content: 'index, follow' },
  ],
  link: [
    {
      rel: 'shortcut icon',
      href: () => iconUrls.value.faviconUrl,
      type: () => ({ svg: 'image/svg+xml', png: 'image/png', ico: 'image/x-icon' }[iconUrls.value.faviconType || ''] || ''),
      sizes: () => iconUrls.value.faviconType === 'svg' ? 'any' : '',
    },
    { rel: 'apple-touch-icon', sizes: '180x180', href: () => iconUrls.value.appleTouchIconUrl },
    { rel: 'icon', sizes: '32x32', href: () => iconUrls.value.appleTouchIconUrl },
    { rel: 'icon', sizes: '16x16', href: () => iconUrls.value.appleTouchIconUrl },
    { rel: 'canonical', href: () => site.value?.frame.displayUrl.value },
    { key: 'font-pre', rel: 'preconnect ', href: 'https://fonts.googleapis.com' },
    { key: 'font-static', rel: 'preconnect ', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { key: 'font', rel: 'stylesheet', href: () => fonts.value?.fontsUrl, id: 'font-link' },
  ],
  script: () => getScript(),
  style: [
    {
      innerHTML: 'html { opacity: 0; transform: scale(.96); transition: opacity 0.7s, transform 0.7s ease; } body.dark { background: #000; }',
    },
  ],
  noscript: () => getScript({ noscript: true }),
})

vue.onMounted(async () => {
  unhead.useHead({
    bodyAttrs: { class: () => !site.value?.isLightMode.value ? 'dark' : 'light' },
  })

  if (!site.value)
    await load()

  fictionSites.trackWebsiteEvents({ site: site.value })

  if (site.value && site.value.siteMode.value === 'editable') {
    const util = new FrameUtility<FramePostMessageList>({
      relation: 'child',
      onMessage: (msg) => {
        if (!site.value)
          throw new Error('FrameUtility: Site not found')

        site.value.frame.processFrameMessage({ msg: msg as FramePostMessageList, scope: 'child' })
      },
    })

    // initialize frame message handling
    util.init()

    const sw = vue.watch(
      () => site?.value,
      () => {
        if (site.value)
          site.value.frame.setUtil(util)
      },
      { immediate: true },
    )

    // initialize resetUi and path watchers
    site?.value.frame.init({ caller: 'FSite' })

    cleanups.push(sw)
  }
})

const colors = vue.computed(() => {
  const config = site.value?.fullConfig.value || {}

  const { primary = 'blue', theme = 'gray' } = config.standard?.scheme?.base || {}

  return { primary: getColorScheme(primary), theme: getColorScheme(theme) }
})

fictionEnv.events.on('cleanup', () => {
  cleanups.forEach(c => c && c())
  site.value?.cleanup()
  site.value = undefined
  cleanups = []
})

vue.onMounted(() => {
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
      document.documentElement.style.setProperty(`--font-family-${stack}`, stacks[stack])
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
    :data-editing-style="site?.editor.value.savedEditingStyle ?? '-'"
    class="x-site bg-theme-50 dark:bg-theme-900 text-theme-800 dark:text-theme-0"
  >
    <div class="x-font-body x-site-content relative z-10 bg-theme-0 dark:bg-theme-950">
      <div
        class="x-engine"
      >
        <div v-if="loading" class="text-theme-300 dark:text-theme-0 flex justify-center pt-32">
          <ElSpinner class="h-12 w-12" />
        </div>

        <template v-else-if="site">
          <component
            :is="site.currentPage.value.tpl.value?.settings.el"
            class="x-site-card"
            :card="site.currentPage.value"
            :params="fictionRouter.params.value"
          />
        </template>
        <template v-else>
          <div class="h-dvh w-full grid min-h-full place-items-center bg-theme-900 text-white px-6 py-24 sm:py-32 lg:px-8">
            <El404 class="" heading="No Site Found" sub-heading="No site was found at this URL" />
          </div>
        </template>
      </div>
    </div>
    <NotifyToaster />
  </div>
</template>

<style lang="less">
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
    &.font-semibold {
      font-weight: var(--font-weight-title, 600);
    }
    &.font-bold {
      font-weight: var(--font-weight-title, 700);
    }
    &.font-light {
      font-weight: var(--font-weight-title, 300);
    }
    &.font-normal {
      font-weight: var(--font-weight-title, 400);
    }
    &.font-medium {
      font-weight: var(--font-weight-title, 500);
    }
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
