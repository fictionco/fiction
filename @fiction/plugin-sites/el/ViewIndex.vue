<script lang="ts" setup>
import ElPanel from '@fiction/ui/ElPanel.vue'
import ElIndexGrid from '@fiction/ui/ElIndexGrid.vue'
import type { ActionItem, FictionApp, IndexItem, IndexMeta } from '@fiction/core'
import { standardDate, useService, vue } from '@fiction/core'

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

const { fictionRouter, fictionSites, fictionAppSites } = useService<{ fictionSites: FictionSites, fictionAppSites: FictionApp }>()

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

const formattedData = vue.computed<IndexItem[]>(() => {
  if (!sites.value)
    return []

  const rows = sites.value.map((site) => {
    const domain = site.primaryCustomDomain.value || fictionAppSites.liveUrl.value.replace('*', site.settings.subDomain || '')
    const displayDomain = domain.replace('https://', '').replace('http://', '')
    const out: IndexItem = {
      name: site.settings.title || 'Untitled',
      key: site.settings.siteId,
      links: [{ name: displayDomain, href: domain, target: '_blank', class: 'underline', icon: 'i-tabler-world' }, { name: `Created ${standardDate(site.settings.createdAt)}` }],
      actions: [
        { name: 'Edit Website', btn: 'primary', href: props.card.link({ path: '/edit-site', query: { siteId: site.settings.siteId } }) },
      ],
      fig: vue.defineAsyncComponent(() => import('./fig/FigSite.vue')),
      figProps: { site },
    }

    return out
  })

  return rows
})

const actions: ActionItem[] = [{
  name: 'Create New Website',
  btn: 'primary',
  onClick: () => {
    showCreateModal.value = true
  },
}]
</script>

<template>
  <ElPanel title="Your Websites" :actions="actions" :class="card.classes.value.contentWidth">
    <ElIndexGrid
      :loading="loading"
      :list="formattedData"
      :index-meta="{}"
      :edit-actions="[]"
      :empty="{
        title: 'Start New Website',
        description: `Welcome to the world's simplest and fastest web creation platform for influencers and professionals.`,
        actions,
        fig: vue.defineAsyncComponent(() => import('./fig/FigSite.vue')),
      }"
      :actions="[]"
      :on-item-click="() => {}"
      @bulk-edit="() => {}"
    />

    <ElSiteStart :vis="showCreateModal" :card="card" />
  </ElPanel>
</template>
