<script lang="ts" setup>
import type { FictionApp, FictionRouter } from '@fiction/core'
import { onResetUi, resetUi, useService, vue, waitFor } from '@fiction/core'
import ElSpinner from '@fiction/ui/loaders/ElSpinner.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import El404 from '@fiction/ui/page/El404.vue'
import XText from '@fiction/ui/common/XText.vue'
import ViewEditor from '@fiction/admin/ViewEditor.vue'
import type { Site } from '../site'
import type { FictionSites } from '..'
import { getMountContext, loadSite } from '../load'
import type { Card } from '../card'
import { activeSiteDisplayUrl } from '../utils/site'
import SiteEditorFrame from './SiteEditorFrame.vue'
import { createSiteEditingController } from './tools/tools'

type UserConfig = {
  isNavItem: boolean
}
defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const service = useService<{ fictionSites: FictionSites, fictionRouterSites: FictionRouter, fictionAppSites: FictionApp }>()
const { fictionRouter, fictionSites, fictionRouterSites } = service

const loading = vue.ref(true)
const sending = vue.ref('')
const editing = vue.ref(false)

const site = vue.shallowRef<Site | undefined>()

async function load() {
  loading.value = true

  try {
    const q = fictionRouter.query.value as Record<string, string>
    const { siteId = q.site, themeId = q.theme, cardId = q.card } = q

    if (!siteId && !themeId && !cardId)
      throw new Error('No site, theme, or card id provided')

    await fictionRouterSites.create({ noBrowserNav: true, caller: 'SiteEditor' })

    const mountContext = getMountContext({ queryVars: { siteId, themeId, cardId }, siteMode: 'designer' })

    site.value = await loadSite({
      fictionSites,
      siteRouter: fictionRouterSites,
      mountContext,
    })

    site.value?.frame.init({ caller: 'SiteEditor' })
  }
  catch (error) {
    console.error('Error loading site', error)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(async () => {
  await load()
})

onResetUi(() => {
  editing.value = false
})

async function save() {
  if (!site.value)
    throw new Error('No site to save')

  sending.value = 'save'

  // make sure any blur events are triggered
  resetUi({ scope: 'all', cause: 'saveSite' })

  await site.value.save({ minTime: 500 })
  sending.value = ''
}
</script>

<template>
  <div
    class="h-full w-full"
    :data-site-router-path="fictionRouterSites?.params.value.viewId ?? '[empty]'"
    :data-view-id="site?.currentViewId.value ?? '[empty]'"
    :data-page-id="site?.activePageId.value ?? '[empty]'"
    :data-theme-id="site?.themeId.value ?? '[empty]'"
    :data-active-pathname="site?.currentPath.value ?? '[empty]'"
  >
    <div v-if="loading" class="">
      <div class="text-theme-300 dark:text-theme-600 flex justify-center pt-32">
        <ElSpinner class="h-12 w-12" />
      </div>
    </div>

    <template v-else>
      <ViewEditor :tool-props="{ site }" :controller="createSiteEditingController(site)">
        <template #headerLeft>
          <ElButton btn="default" :href="card.link('/')">
            <div class="i-tabler-home text-lg" />
          </ElButton>
          <div class="flex space-x-1 font-medium">
            <RouterLink
              class=" whitespace-nowrap text-theme-400 dark:text-theme-300  pr-1 hover:text-primary-500 dark:hover:text-theme-0 flex items-center gap-1"
              :to="card.link('/')"
            >
              <span class="i-tabler-browser-plus text-xl inline-block dark:text-theme-500" />
              <span>Site Designer</span>
              <span class="i-tabler-slash text-xl dark:text-theme-500" />
            </RouterLink>

            <XText v-if="site" v-model="site.title.value" :is-editable="true" class="hover:bg-theme-100 whitespace-nowrap" />
          </div>
        </template>
        <template v-if="site" #headerRight>
          <ElButton
            btn="default"
            :href="activeSiteDisplayUrl(site, { mode: 'staging' }).value"
            target="_blank"
            size="md"
            icon="i-tabler-arrow-up-right"
          >
            View
          </ElButton>
          <ElButton
            btn="primary"
            :loading="sending === 'save'"
            class=" min-w-36"
            icon="i-tabler-arrow-big-up-lines"
            size="md"
            @click.prevent="save()"
          >
            Save Site
          </ElButton>
        </template>
        <template #default>
          <El404 v-if="!site && !loading" heading="Site Not Found" sub-heading="No site was found here." />
          <SiteEditorFrame v-else :site="site" />
        </template>
      </ViewEditor>
    </template>
  </div>
</template>
