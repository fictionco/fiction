<script lang="ts" setup>
import type { ActionButton } from '@fiction/core'
import type { Card } from '../..'
import type { FictionSites } from '../../index.js'
import type { Site } from '../../site.js'
import type { SiteListItem } from '../../utils/list.js'
import type { getWidgets } from './index.js'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import { useService, vue } from '@fiction/core'
import { getSiteIndexItemList } from '../../utils/list.js'
import { manageSiteIndex } from '../../utils/manage.js'
import ElSitePreviewFrame from '../ElSitePreviewFrame.vue'

type WidgetConfig = ReturnType<typeof getWidgets>['sites']

const props = defineProps({
  widget: { type: Object as vue.PropType<WidgetConfig>, required: true },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionSites: FictionSites }>()

const loading = vue.ref(false)
const sites = vue.shallowRef<Site[]>([])

vue.onMounted(async () => {
  loading.value = true

  try {
    const result = await manageSiteIndex({ fictionSites: service.fictionSites, params: { _action: 'list', limit: 5 } })

    if (result.sites) {
      sites.value = result.sites
    }
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
})

const list = vue.computed<SiteListItem[]>(() => {
  return getSiteIndexItemList(sites.value, props.card)
})
</script>

<template>
  <WidgetWrap :widget>
    <div class="flex flex-col relative">
      <ElSitePreviewFrame :item="list[0]" class="aspect-[16/9]  border-b border-theme-200 dark:border-theme-700" />
    </div>
  </WidgetWrap>
</template>
