<script lang="ts" setup>
import type { FactorApp, FactorAppEntry, FactorRouter } from '@fiction/core'
import { log, unhead, useService, vue } from '@fiction/core'
import type { FactorAdmin } from '@fiction/plugin-admin'
import type { FactorSites } from '..'
import { getMountContext } from '../load'

const service = useService<{ factorAppSites: FactorApp, factorRouterSites: FactorRouter, factorAdmin: FactorAdmin, factorSites: FactorSites }>()

const base = service.factorSites.getPreviewPath({ factorAdmin: service.factorAdmin })

/**
 * Set base for relative links using native <base> tag
 */
unhead.useHead({
  base: {
    href: base.value,
  },
})

// Reference to hold the mounted app
let entry: FactorAppEntry | undefined = undefined

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

    // Set base for router links
    service.factorRouterSites.routeBasePath = base.value

    const { selectorType, selectorId } = (service.factorRouter.params.value || {}) as Record<string, string>

    const mountContext = getMountContext({ selectorType, selectorId, siteMode: 'editable' })

    entry = await service.factorAppSites.mountApp({ selector: '#admin-app', service: s, runVars: { ...runVars, MOUNT_CONTEXT: mountContext } })
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
  <div id="admin-app" />
</template>
