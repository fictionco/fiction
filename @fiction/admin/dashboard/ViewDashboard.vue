<script lang="ts" setup>
import type { Card, FictionSites, Site } from '@fiction/site'
import type { FictionAdmin } from '../index'
import type { WidgetConfig } from '../widgets/index'
import { useService, vue } from '@fiction/core'
import { getPrimarySite } from '@fiction/site/utils/load'
import ViewDashboardModals from './ViewDashboardModals.vue'

const { card } = defineProps<{
  card: Card
}>()

const { fictionAdmin, fictionUser, fictionSites } = useService<{ fictionAdmin: FictionAdmin, fictionSites: FictionSites }>()

const org = vue.computed(() => fictionUser.activeOrganization.value)
const loading = vue.ref(true)
const widgets = vue.shallowRef<WidgetConfig[]>([])
const primarySite = vue.shallowRef<Site>()

async function load() {
  loading.value = true
  try {
    await fictionUser.userInitialized({ caller: 'widget' })
    const r = await Promise.all([fictionAdmin.getWidgets({ card }), getPrimarySite({ fictionSites, orgId: org.value?.orgId })])
    widgets.value = r[0]
    primarySite.value = r[1]
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
}

vue.onMounted(async () => load())
</script>

<template>
  <div class="max-w-[960px] mx-auto p-6 md:p-12 flex flex-col gap-4 lg:gap-8 xl:gap-12 justify-center min-h-[100dvh] overflow-scroll no-scrollbar">
    <component
      :is="widget.el"
      v-for="(widget, i) in widgets"
      :key="i"
      :card
      :widget
      class="w-full"
      :primary-site="primarySite"
      :org
    />

    <ViewDashboardModals :card :org :primary-site="primarySite" />
  </div>
</template>
