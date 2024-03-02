<script lang="ts" setup>
import type { FactorApp, FactorRouter } from '@fiction/core'
import { onResetUi, resetUi, toLabel, useService, vue } from '@fiction/core'
import ElSpinner from '@fiction/ui/ElSpinner.vue'
import ElButton from '@fiction/ui/ElButton.vue'
import El404 from '@fiction/ui/El404.vue'
import type { Site } from '../site'
import type { FactorSites } from '..'
import { getMountContext, loadSite } from '../load'
import { saveSite } from '../utils/site'
import type { Card } from '../card'
import SiteEditorEditMode from './SiteEditorEditMode.vue'
import XTextBase from './XTextBase.vue'

type UserConfig = {
  isNavItem: boolean
  layoutFormat: 'full'
}
const props = defineProps({
  card: {
    type: Object as vue.PropType<Card<UserConfig>>,
    required: true,
  },
})

const service = useService<{ factorSites: FactorSites, factorRouterSites: FactorRouter, factorAppSites: FactorApp }>()
const { factorRouter, factorSites, factorRouterSites } = service

const loading = vue.ref(true)
const sending = vue.ref('')
const editing = vue.ref(false)
const editModes = [
  { name: 'Edit', value: `edit` },
  { name: 'Settings', value: 'settings' },
  { name: 'Share', value: 'share' },
] as const
type EditModes = typeof editModes[number]['value']

const activeEditMode = vue.computed<EditModes>({
  get: () => {
    const topic = factorRouter?.query.value.topic || 'edit'
    return topic as EditModes
  },
  set: async (v) => {
    await factorRouter?.replace({
      name: 'admin',
      params: { ...factorRouter?.params.value },
      query: { ...factorRouter?.query.value, topic: v },
    })
  },
})

const site = vue.shallowRef<Site | undefined>()

async function load() {
  loading.value = true

  try {
    const { siteId } = factorRouter.query.value as Record<string, string>

    if (!siteId)
      throw new Error('No siteId')

    await factorRouterSites.create({ noBrowserNav: true, caller: 'SiteEditor' })

    const mountContext = getMountContext({ queryVars: { siteId }, siteMode: 'editor' })

    site.value = await loadSite({
      factorSites,
      siteRouter: factorRouterSites,
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
  await saveSite({ site: site.value })
  sending.value = ''
}
</script>

<template>
  <div
    class="h-full w-full"
    :data-site-router-path="factorRouterSites?.params.value.viewId ?? '[empty]'"
    :data-view-id="site?.currentViewId.value ?? '[empty]'"
    :data-page-id="site?.activePageId.value ?? '[empty]'"
  >
    <div v-if="loading" class="">
      <div class="text-theme-300 dark:text-theme-600 flex justify-center pt-32">
        <ElSpinner class="h-12 w-12" />
      </div>
    </div>
    <El404 v-else-if="!site && !loading" heading="Site Not Found" sub-heading="No site was found here." />
    <div v-else class="grid grid-flow-dense h-full grid-cols-[1fr] grid-rows-[auto_minmax(0,1fr)]">
      <div class="border-b border-theme-200 dark:border-theme-700 bg-theme-0 dark:bg-theme-950">
        <div class="grid-cols-12 py-2 md:grid md:items-center md:justify-between px-4">
          <div class="col-span-6 items-center flex text-sm lg:text-base space-x-4">
            <ElButton btn="default" :href="card.link('/')">
              <div class="i-tabler-home text-lg" />
            </ElButton>
            <div class="flex space-x-1 font-medium">
              <RouterLink
                class="text-theme-400 block pr-1 hover:text-primary-500"
                :to="card.link('/')"
              >
                Site /
              </RouterLink>

              <XTextBase v-if="site" v-model="site.title.value" :is-editable="true" class="hover:bg-theme-100" />
            </div>
          </div>
          <div
            class="col-span-6 items-center justify-center space-x-2 hidden"
          >
            <div
              v-for="(item, i) in editModes"
              :key="i"
              class="text-xs rounded-lg py-1.5 px-3 min-w-20 text-center transition-colors font-semibold duration-75 cursor-pointer "
              :class="
                item.value === activeEditMode
                  ? `text-theme-50 bg-theme-600`
                  : `text-theme-600 hover:bg-theme-200 bg-theme-100`
              "
              @click.stop="site ? (activeEditMode = item.value) : ''"
            >
              {{ toLabel(item.value) }}
            </div>
          </div>
          <div
            class="col-span-6 flex items-center justify-end space-x-2 text-right text-sm"
          >
            <ElButton
              btn="primary"
              :loading="sending === 'save'"
              class=" min-w-36"
              @click.prevent="save()"
            >
              Save Changes
            </ElButton>
          </div>
        </div>
      </div>

      <SiteEditorEditMode
        v-if="activeEditMode === 'edit'"
        :site="site"
      />
    </div>
  </div>
</template>

<style lang="less">
.editor-work-area {

  .manager-area {
    --input-size: 13px;
    --input-bg: #ffffff;
  }
}
</style>
