<script lang="ts" setup>
import type { FictionApp, FictionRouter } from '@fiction/core'
import { onResetUi, resetUi, useService, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/ElSpinner.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import El404 from '@fiction/ui/El404.vue'
import XTextBase from '@fiction/ui/XTextBase.vue'
import type { Site } from '../site'
import type { FictionSites } from '..'
import { getMountContext, loadSite } from '../load'
import type { Card } from '../card'
import { activeSiteDisplayUrl } from '../utils/site'
import SiteEditorEditMode from './SiteEditorEditMode.vue'
import SiteEditorFrame from './SiteEditorFrame.vue'
import { siteEditController } from './tools'

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
    const { siteId } = fictionRouter.query.value as Record<string, string>

    if (!siteId)
      throw new Error('No siteId')

    await fictionRouterSites.create({ noBrowserNav: true, caller: 'SiteEditor' })

    const mountContext = getMountContext({ queryVars: { siteId }, siteMode: 'editor' })

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

  // make sure any blur events are triggered
  resetUi({ scope: 'all', cause: 'saveSite' })

  sending.value = 'save'
  await site.value.save()
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
    <El404 v-else-if="!site && !loading" heading="Site Not Found" sub-heading="No site was found here." />
    <template v-else>
      <SiteEditorEditMode :site="site" :controller="siteEditController">
        <template #headerLeft>
          <ElButton btn="default" :href="card.link('/')">
            <div class="i-tabler-home text-lg" />
          </ElButton>
          <div class="flex space-x-1 font-medium">
            <RouterLink
              class="text-theme-400 block pr-1 hover:text-primary-500"
              :to="card.link('/')"
            >
              Site Builder /
            </RouterLink>

            <XTextBase v-if="site" v-model="site.title.value" :is-editable="true" class="hover:bg-theme-100" />
          </div>
        </template>
        <template v-if="site" #headerRight>
          <ElButton
            btn="default"
            :href="activeSiteDisplayUrl(site, { mode: 'staging' }).value"
            target="_blank"
          >
            View
          </ElButton>
          <ElButton
            btn="primary"
            :loading="sending === 'save'"
            class=" min-w-36"
            icon="i-tabler-save"
            @click.prevent="save()"
          >
            Save Site
          </ElButton>
        </template>
        <template #default>
          <SiteEditorFrame :site="site" />
        </template>
      </SiteEditorEditMode>
    </template>
  </div>
</template>
