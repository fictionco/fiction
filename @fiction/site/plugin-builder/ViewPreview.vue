<script lang="ts" setup>
import type { FictionApp, FictionAppEntry, FictionRouter } from '@fiction/core'
import type { FictionSites } from '..'
import type { SiteMode } from '../load'
import { log, unhead, useService, vue } from '@fiction/core'
import { getMountContext } from '../load'

const service = useService<{ fictionAppSites: FictionApp, fictionRouterSites: FictionRouter, fictionSites: FictionSites }>()

const base = vue.computed(() => {
  return service.fictionRouter.current.value.path || '/'
})

/**
 * Set base for relative links using native <base> tag
 */
unhead.useHead({
  htmlAttrs: { lang: 'en', dir: 'ltr', class: 'dark', style: 'color-scheme: dark;' },
  base: {
    href: () => base.value,
  },
})

const themeIds = vue.computed(() => service.fictionSites.themes.value.map(theme => theme?.themeId))

// Reference to hold the mounted app
let entry: FictionAppEntry | undefined = undefined

/**
 * Function to mount the app
 */
async function mountApp() {
  try {
    // Unmount the existing app if it's already mounted
    if (entry?.app) {
      await entry?.app.unmount()
      entry = undefined
    }

    const { runVars, ...s } = service

    await service.fictionUser.userInitialized({ caller: 'PreviewComponent' })

    const orgId = service.fictionUser.activeOrgId.value

    // Set base for router links
    service.fictionRouterSites.routeBasePath = base.value

    const siteMode = (service.fictionRouter.query.value?._siteMode || 'editable') as SiteMode
    const { selectorType, selectorId } = (service.fictionRouter.params.value || {}) as Record<string, string>

    const mountContext = getMountContext({ runVars, orgId, selectorType, selectorId, siteMode, caller: 'PreviewComponent' })

    const serviceConfig = { fictionEnv: service.fictionEnv, service: s, runVars: { ...runVars, MOUNT_CONTEXT: mountContext } }

    entry = await service.fictionAppSites.mountApp({ selector: '#admin-app', serviceConfig })
  }
  catch (error) {
    log.error('PreviewComponent', `Error mounting preview app: ${(error as Error).message}`, { error })
  }
}

vue.onMounted(async () => {
  vue.watch(base, mountApp, { immediate: true })
})
</script>

<template>
  <div
    id="admin-app"
    :data-route="service.fictionRouterSites.current.value.fullPath"
    :data-route-count="service.fictionRouterSites.routes.value.length"
    :data-theme-ids="themeIds.join(', ')"
  />
</template>
