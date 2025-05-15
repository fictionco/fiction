<script lang="ts" setup>
import type { ActionButton, FictionApp, IndexMeta } from '@fiction/core'
import type { FictionSites } from '..'
import type { Card } from '../card'
import type { Site } from '../site'
import type { SiteListItem } from '../utils/list.js'
import SettingsPanel from '@fiction/admin/settings/SettingsPanel.vue'
import { dayjs, useService, vue } from '@fiction/core'
import XButton from '@fiction/ui/buttons/XButton.vue'
import XLink from '@fiction/ui/common/XLink.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import { getSiteIndexItemList } from '../utils/list.js'
import { manageSiteIndex } from '../utils/manage.js'
import ElSitePreviewFrame from './ElSitePreviewFrame.vue'
import ElSiteStart from './ElSiteStart.vue'

defineOptions({
  name: 'ManageIndex',
})

const props = defineProps({
  card: { type: Object as vue.PropType<Card>, required: true },
})

const { fictionSites, fictionRouter } = useService<{ fictionSites: FictionSites, fictionAppSites: FictionApp }>()

const showCreateModal = vue.ref(false)

const loading = vue.ref(false)
const sites = vue.shallowRef<Site[]>([])
const indexMeta = vue.ref<IndexMeta>()
async function loadIndex() {
  loading.value = true
  const r = await manageSiteIndex({ fictionSites, params: { _action: 'list', limit: 10 } })
  sites.value = r.sites || []
  indexMeta.value = r.indexMeta
  loading.value = false
}

vue.onMounted(async () => {
  await loadIndex()

  vue.watchEffect(() => {
    if (fictionRouter.query.value.addNew) {
      showCreateModal.value = true
      fictionRouter.query.value = { }
    }
  })
})

const list = vue.computed<SiteListItem[]>(() => {
  return getSiteIndexItemList(sites.value, props.card)
})

function getActions(location: 'top' | 'zero') {
  const buttons: ActionButton[] = [{
    testId: 'createSite',
    label: 'Create New Site',
    icon: 'i-tabler-plus',
    theme: 'primary',
    onClick: () => (showCreateModal.value = true),
  }]
  return location === 'zero' || list.value.length > 0 ? { buttons } : {}
}
</script>

<template>
  <SettingsPanel>
    <div class="p-4 md:p-6 xl:p-8">
      <ElIndexGrid
        :loading
        :list
        list-title="Sites"
        :index-meta="{}"
        :edit-actions="[]"
        :empty="{
          title: 'Sites',
          subTitle: `The homebase for your online presence.`,
          action: getActions('zero'),
          media: { class: 'i-tabler-browser-plus' },
        }"
        theme="primary"
        :action="getActions('top')"
        :on-item-click="() => {}"
        @bulk-edit="() => {}"
      >
        <template #list>
          <div v-for="item in list" :key="item.key">
            <XLink
              :card
              :href="item.href"
              class="group flex h-full overflow-hidden border border-theme-300/60 dark:border-theme-600/80 bg-white dark:bg-theme-800/40 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex flex-col gap-4 flex-grow p-4 basis-[350px] border-r border-theme-300/40 dark:border-theme-600/40">
                <div class="flex items-start justify-between">
                  <div>
                    <h3 class="font-semibold text-lg">
                      {{ item.label }}
                    </h3>
                  </div>
                </div>

                <div class="mt-auto pt-3 flex items-center text-xs text-theme-400 dark:text-theme-500" title="Last updated">
                  <XButton
                    :href="item.href"
                    :theme="item.isPrimary ? 'primary' : 'default'"
                    design="solid"
                    size="sm"
                    :icon="item.isPrimary ? 'i-tabler-bolt' : 'i-tabler-code'"
                    :test-id="item.testId"
                  >
                    {{ item.description }}
                  </XButton>
                </div>
              </div>

              <ElSitePreviewFrame :url="item.stagingUrl" class="aspect-square border-b border-theme-200 dark:border-theme-700" />
            </XLink>
          </div>
        </template>
      </ElIndexGrid>
    </div>

    <ElSiteStart v-model:vis="showCreateModal" :card />
  </SettingsPanel>
</template>
