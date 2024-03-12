<script lang="ts" setup>
import type { FictionRouter } from '@fiction/core'
import { log, unhead, useService, vue } from '@fiction/core'
import { FrameUtility } from '@fiction/ui/elBrowserFrameUtil'
import ElSpinner from '@fiction/ui/ElSpinner.vue'
import El404 from '@fiction/ui/El404.vue'
import NotifyToaster from '@fiction/plugin-notify/NotifyToaster.vue'
import type { FictionSites, Site } from '..'
import { getMountContext, loadSite } from '../load'
import type { FramePostMessageList } from '../utils/frame'

const props = defineProps({
  themeId: { type: String, default: undefined },
  siteRouter: { type: Object as vue.PropType<FictionRouter>, default: undefined },
})

const { fictionSites, runVars, fictionRouterSites } = useService<{ fictionSites: FictionSites, fictionRouterSites: FictionRouter }>()

const loading = vue.ref(false)
const site = vue.shallowRef<Site>()
const fonts = vue.computed(() => site?.value?.theme.value?.fonts())

async function load() {
  loading.value = true

  try {
    const mountContext = getMountContext({
      queryVars: { themeId: props.themeId }, // passed in by route sometimes
      currentSubDomain: runVars?.SUBDOMAIN, // standard sites loaded on sub domain
      mountContext: runVars?.MOUNT_CONTEXT, // used during preview
    })
    site.value = await loadSite({
      siteRouter: props.siteRouter || fictionRouterSites,
      fictionSites,
      mountContext,
    })
  }
  catch (error) {
    log.error('XSite.vue', `Error loading site ${(error as Error).message}`, { error })
  }
  finally {
    loading.value = false
  }
}
unhead.useHead({
  title: 'Site',
  meta: [
    { name: `description`, content: `` },
    { name: 'robots', content: () => site.value?.userConfig.value.robotsTxt || 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { property: 'og:site_name', content: () => site.value?.title.value || 'untitled' },
    { property: 'og:locale', content: () => site.value?.userConfig.value.locale || 'en_US' },
  ],
  link: [
    { rel: 'shortcut icon', href: () => site.value?.userConfig.value.faviconUrl || '/favicon.png' },
    { key: 'font-pre', rel: 'preconnect ', href: 'https://fonts.googleapis.com' },
    { key: 'font-static', rel: 'preconnect ', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
    { key: 'font', rel: 'stylesheet ', href: () => fonts.value?.getFontUrl() },
  ],
})

vue.onServerPrefetch(async () => {
  await load()
})

vue.onMounted(async () => {
  unhead.useHead({
    bodyAttrs: {
      class: () => site.value?.isDarkMode.value ? 'dark' : 'light',
    },
  })

  if (!site.value)
    await load()

  if (site.value && site.value.isEditable.value) {
    const util = new FrameUtility<FramePostMessageList>({
      relation: 'child',
      onMessage: (msg) => {
        if (!site.value)
          throw new Error('Site not found')

        site.value.frame.processFrameMessage({ msg: msg as FramePostMessageList, scope: 'child' })
      },
    })

    // initialize frame message handling
    util.init()

    // initialize resetUi and path watchers
    site?.value.frame.init({ caller: 'XSite' })

    vue.watch(
      () => site?.value,
      () => {
        if (site.value)
          site.value.frame.setUtil(util)
      },
      { immediate: true },
    )
  }
})

const colors = vue.computed(() => site.value?.colors.value)
const primary = vue.computed(() => site.value?.colors.value.primary)
</script>

<template>
  <div class="x-site overflow-y-scroll h-full w-full relative">
    <div class="antialiased x-font-body  bg-theme-0 dark:bg-theme-950 text-theme-1000 dark:text-theme-0" :class="site?.isEditable.value ? '' : ''">
      <div
        class="x-engine"
        :data-site-id="site?.siteId ?? '[empty]'"
        :data-pathname="site?.currentPath.value ?? '[empty]'"
        :data-view-id="site?.currentViewId.value ?? '[empty]'"
        :data-page-id="site?.activePageId.value ?? '[empty]'"
        :data-theme-id="site?.themeId.value ?? '[empty]'"
        :data-sub-domain="site?.subDomain.value ?? '[empty]'"
        :data-site-mode="site?.siteMode.value ?? '[empty]'"
      >
        <div v-if="loading" class="text-theme-300 dark:text-theme-0 flex justify-center pt-32">
          <ElSpinner class="h-12 w-12" />
        </div>

        <template v-else-if="site">
          <component :is="site.currentPage.value.tpl.value?.settings.el" class="wrap" :card="site.currentPage.value" />
        </template>
        <template v-else>
          <div class="h-dvh w-full grid min-h-full place-items-center bg-theme-950 text-white px-6 py-24 sm:py-32 lg:px-8">
            <El404 class="" title="No Site Found" description="No site was found at this URL" />
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
  height: 100%;
}

.x-site{
  --font-family-mono: v-bind(fonts?.mono);
  --font-family-input: v-bind(fonts?.input);
  --font-family-sans: v-bind(fonts?.sans);
  --font-family-serif: v-bind(fonts?.serif);
  --font-family-title: v-bind(fonts?.title);
  --font-family-body: v-bind(fonts?.body);
  .x-font-title {
    font-family: var(--font-family-title);
  }
  .x-font-body {
    font-family: var(--font-family-body);
  }
  .x-font-input {
    font-family: var(--font-family-input);
  }
  .x-font-mono {
    font-family: var(--font-family-mono);
  }
  .x-font-sans {
    font-family: var(--font-family-sans);
  }
  --canvas-main: v-bind("colors?.canvasMain");
  --canvas-border: v-bind("colors?.canvasBorder");
  --canvas-panel: v-bind("colors?.canvasPanel");
  --theme-0: v-bind("colors?.theme[0]");
  --theme-25: v-bind("colors?.theme[25]");
  --theme-50: v-bind("colors?.theme[50]");
  --theme-100: v-bind("colors?.theme[100]");
  --theme-200: v-bind("colors?.theme[200]");
  --theme-300: v-bind("colors?.theme[300]");
  --theme-400: v-bind("colors?.theme[400]");
  --theme-500: v-bind("colors?.theme[500]");
  --theme-600: v-bind("colors?.theme[600]");
  --theme-700: v-bind("colors?.theme[700]");
  --theme-800: v-bind("colors?.theme[800]");
  --theme-900: v-bind("colors?.theme[900]");
  --theme-950: v-bind("colors?.theme[950]");
  --theme-975: v-bind("colors?.theme[975]");
  --theme-1000: v-bind("colors?.theme[1000]");
  --primary-0: v-bind("primary?.[0]");
  --primary-25: v-bind("primary?.[25]");
  --primary-50: v-bind("primary?.[50]");
  --primary-100: v-bind("primary?.[100]");
  --primary-200: v-bind("primary?.[200]");
  --primary-300: v-bind("primary?.[300]");
  --primary-400: v-bind("primary?.[400]");
  --primary-500: v-bind("primary?.[500]");
  --primary-600: v-bind("primary?.[600]");
  --primary-700: v-bind("primary?.[700]");
  --primary-800: v-bind("primary?.[800]");
  --primary-900: v-bind("primary?.[900]");
  --primary-950: v-bind("primary?.[950]");
  --primary-975: v-bind("primary?.[975]");
  --primary-1000: v-bind("primary?.[1000]");
}
</style>
