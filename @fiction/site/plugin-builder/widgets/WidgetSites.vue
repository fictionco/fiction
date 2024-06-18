<script lang="ts" setup>
import type { ActionItem, IndexItem } from '@fiction/core'
import { dayjs, useService, vue } from '@fiction/core'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import IndexItemList from '@fiction/ui/lists/IndexItemList.vue'
import type { Card } from '../..'
import { manageSiteIndex } from '../../utils/manage.js'
import type { FictionSites } from '../../index.js'
import type { Site } from '../../site.js'
import { getSiteIndexItemList } from '../utils.js'
import type { getWidgets } from './index.js'

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

const actions: ActionItem[] = [
  {
    name: 'View Sites',
    icon: 'i-tabler-layout-grid',
    href: props.card.link('/sites'),
  },

]

const list = vue.computed<IndexItem[]>(() => {
  return getSiteIndexItemList(sites.value, props.card)
})
</script>

<template>
  <WidgetWrap :widget :actions>
    <IndexItemList :list :actions="[{ name: 'Add Site', btn: 'primary', href: card.link('/sites?addNew=1') }]" zero-text="No sites found. Create one.">
      <template #subTitle="{ item }">
        <div class="flex items-center gap-4">
          <span class="inline-flex gap-1 items-center"><span class="i-tabler-world" /><span>{{ item.desc }}</span></span>
          <time v-if="item.dateIso" class="text-theme-400">Updated {{ dayjs(item.dateIso).format('MMM DD, YYYY') }}</time>
        </div>
      </template>
    </IndexItemList>
  </WidgetWrap>
</template>
