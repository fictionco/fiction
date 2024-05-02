<script lang="ts" setup>
import ElPanel from '@fiction/ui/ElPanel.vue'
import ElIndexGrid from '@fiction/ui/ElIndexGrid.vue'
import type { ActionItem, FictionApp, IndexItem, IndexMeta } from '@fiction/core'
import { useService, vue } from '@fiction/core'

import type { Site } from '../site'
import type { FictionSites } from '..'
import type { Card } from '../card'
import ElSiteStart from './ElSiteStart.vue'

type UserConfig = {
  isNavItem: boolean
}
const props = defineProps({
  card: { type: Object as vue.PropType<Card<UserConfig>>, required: true },
})

const { fictionSites, fictionAppSites } = useService<{ fictionSites: FictionSites, fictionAppSites: FictionApp }>()

const showCreateModal = vue.ref(false)

const loading = vue.ref(false)
const sites = vue.shallowRef<Site[]>([])
const indexMeta = vue.ref<IndexMeta>()
async function loadIndex() {
  loading.value = true
  const r = await fictionSites.requestIndex()
  sites.value = r.items || []
  indexMeta.value = r.indexMeta
  loading.value = false
}

vue.onMounted(async () => {
  await loadIndex()
})

const list = vue.computed<IndexItem[]>(() => {
  if (!sites.value)
    return []

  const rows = sites.value.map((site) => {
    const domain = site.primaryCustomDomain.value || fictionAppSites.liveUrl.value.replace('*', site.settings.subDomain || '')
    const displayDomain = domain.replace('https://', '').replace('http://', '').replace('www.', '')
    const editLink = props.card.link({ path: '/edit-site', query: { siteId: site.settings.siteId } })
    const out: IndexItem = {
      name: site.settings.title || 'Untitled',
      desc: `${displayDomain}`,
      key: site.settings.siteId,
      href: editLink,
      figure: { el: vue.defineAsyncComponent(() => import('./fig/FigSite.vue')), props: { site } },

    }

    return out
  })

  return rows
})

function getActions(location: 'top' | 'zero') {
  const actions: ActionItem[] = [{ name: 'Create New Site', icon: 'i-tabler-plus', btn: 'primary', onClick: () => (showCreateModal.value = true) }]
  return location === 'zero' || list.value.length > 0 ? actions : []
}
</script>

<template>
  <ElPanel :class="card.classes.value.contentWidth">
    <div class="pt-8  ">
      <ElIndexGrid
        :loading="loading"
        :list="list"
        list-title="Sites"
        :index-meta="{}"
        :edit-actions="[]"
        :empty="{
          name: 'Create Your First Site',
          desc: `The homebase for your online presence. Create a search engine optimized website in minutes.`,
          actions: getActions('zero'),
          icon: 'i-tabler-browser-plus',
        }"
        :actions="getActions('top')"
        :on-item-click="() => {}"
        @bulk-edit="() => {}"
      />
    </div>

    <ElSiteStart v-model:vis="showCreateModal" :card="card" />
  </ElPanel>
</template>
