<script lang="ts" setup>
import type { ActionButton, FictionApp, IndexItem, IndexMeta } from '@fiction/core'
import type { FictionSites } from '..'
import type { Card } from '../card'
import type { Site } from '../site'
import { useService, vue } from '@fiction/core'
import ElPanel from '@fiction/ui/ElPanel.vue'
import ElIndexGrid from '@fiction/ui/lists/ElIndexGrid.vue'
import { manageSiteIndex } from '../utils/manage.js'
import ElSiteStart from './ElSiteStart.vue'
import { getSiteIndexItemList } from './utils.js'

type UserConfig = {
  isNavItem: boolean
}
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
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

const list = vue.computed<IndexItem[]>(() => {
  return getSiteIndexItemList(sites.value, props.card)
})

function getActions(location: 'top' | 'zero') {
  const actions: ActionButton[] = [{
    testId: 'createSite',
    name: 'Create New Site',
    icon: 'i-tabler-plus',
    theme: 'primary',
    onClick: () => (showCreateModal.value = true),
  }]
  return location === 'zero' || list.value.length > 0 ? actions : []
}
</script>

<template>
  <ElPanel class="p-12 w-full max-w-screen-md mx-auto">
    <div class="pt-8  ">
      <ElIndexGrid
        :loading="loading"
        :list="list"
        list-title="Sites"
        :index-meta="{}"
        :edit-actions="[]"
        :empty="{
          name: 'Create Your First Site',
          desc: `The homebase for your online presence.`,
          actions: getActions('zero'),
          icon: 'i-tabler-browser-plus',
        }"
        :actions="getActions('top')"
        :on-item-click="() => {}"
        @bulk-edit="() => {}"
      />
    </div>

    <ElSiteStart v-model:vis="showCreateModal" :card />
  </ElPanel>
</template>
