<script lang="ts" setup>
import type { ActionButton, IndexItem } from '@fiction/core'
import type { Card } from '../..'
import type { FictionSites } from '../../index.js'
import type { Site } from '../../site.js'
import type { getWidgets } from './index.js'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import { dayjs, useService, vue } from '@fiction/core'
import IndexItemList from '@fiction/ui/lists/IndexItemList.vue'
import { getSiteIndexItemList } from '../../utils/list.js'
import { manageSiteIndex } from '../../utils/manage.js'

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

const buttons: ActionButton[] = [
  {
    label: 'View Sites',
    icon: 'i-tabler-layout-grid',
    href: props.card.link('/sites'),
  },

]

const list = vue.computed<IndexItem[]>(() => {
  return getSiteIndexItemList(sites.value, props.card)
})
</script>

<template>
  <WidgetWrap :widget :buttons>
    <IndexItemList
      :list
      :action="{
        buttons: [{ label: 'Add Site', theme: 'primary', href: card.link('/sites?addNew=1') }],
      }"
      zero-text="No sites found. Create one."
      theme="green"
    >
      <template #subTitle="{ item }">
        <div class="flex items-center gap-4">
          <span class="inline-flex gap-1 items-center"><span class="i-tabler-world" /><span>{{ item.description }}</span></span>
          <time v-if="item.dateIso" class="text-theme-400">Updated {{ dayjs(item.dateIso).format('MMM DD, YYYY') }}</time>
        </div>
      </template>
    </IndexItemList>
  </WidgetWrap>
</template>
