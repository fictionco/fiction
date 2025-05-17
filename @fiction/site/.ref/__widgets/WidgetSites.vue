<script lang="ts" setup>
import type { Card } from '../..'
import type { FictionSites } from '../../index.js'
import type { Site } from '../../site.js'
import type { SiteListItem } from '../../utils/list.js'
import type { getWidgets } from './index.js'
import WidgetWrap from '@fiction/admin/dashboard/WidgetWrap.vue'
import { cardConfig } from '@fiction/cards'
import { useService, vue } from '@fiction/core'
import XLink from '@fiction/ui/common/XLink.vue'
import { getSiteIndexItemList } from '../../utils/list.js'
import { manageSiteIndex, siteLink } from '../../utils/manage.js'
import ElSitePreviewFrame from '../ElSitePreviewFrame.vue'

type WidgetConfig = ReturnType<typeof getWidgets>['sites']

const props = defineProps({
  widget: { type: Object as vue.PropType<WidgetConfig>, required: true },
  card: { type: Object as vue.PropType<Card>, required: true },
})

const service = useService<{ fictionSites: FictionSites }>()

const loading = vue.ref(false)
const primarySite = vue.shallowRef<Site>()

vue.onMounted(async () => {
  loading.value = true

  try {
    const result = await manageSiteIndex({
      fictionSites: service.fictionSites,
      params: {
        _action: 'list',
        filters: [[{ field: 'is_primary', value: true, operator: '=' }]],
      },
    })

    if (result.sites) {
      primarySite.value = result.sites[0]
    }
  }
  catch (e) {
    console.error(e)
  }
  finally {
    loading.value = false
  }
})

const editLink = vue.computed(() => {
  const site = props.card.site

  const out = siteLink({ site, location: { path: '/edit-site', query: { siteId: primarySite.value?.siteId } } })

  return out
})
</script>

<template>
  <WidgetWrap :widget>
    <XLink v-if="primarySite" class="flex flex-col relative" :href="editLink">
      <ElSitePreviewFrame :url="primarySite?.frame.currentSiteFrameUrl.value" class="aspect-[16/9]  border-b border-theme-200 dark:border-theme-700" />
    </XLink>
  </WidgetWrap>
</template>
