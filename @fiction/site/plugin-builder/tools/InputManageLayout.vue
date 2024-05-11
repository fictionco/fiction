<script lang="ts" setup>
import type { vue } from '@fiction/core'
import type { EditorTool } from '@fiction/admin'
import type { Site } from '../../site'
import DraggableLayout from './LayoutDraggable.vue'
import LayoutToolRegion from './LayoutToolRegion.vue'

const props = defineProps({
  site: {
    type: Object as vue.PropType<Site>,
    required: true,
  },
  tool: {
    type: Object as vue.PropType<EditorTool>,
    required: true,
  },
})

// const actions: ActionItem[] = [
//   {
//     name: 'Add Elements',
//     icon: 'i-tabler-new-section',
//     onClick: () => {
//       props.site.activeRegionKey.value = 'main'
//       siteEditController.useTool({ toolId: 'add' })
//     },
//   },
// ]

// const pageList = vue.computed<ListItem[]>(() => {
//   return props.site.pages.value.map((r) => {
//     return {
//       name: r.displayTitle.value || 'Untitled',
//       value: r.cardId,
//     }
//   })
// })
</script>

<template>
  <div class="list relative">
    <DraggableLayout class="relative rounded-md space-y-1.5" @update:model-value="site.updateLayout({ order: $event })">
      <LayoutToolRegion scope="Page" region-id="main" :card="site.currentPage.value" :site="site" />
      <LayoutToolRegion
        v-for="(card, regionId) in site.sections.value"
        :key="regionId"
        :region-id="String(regionId)"
        :card="card"
        :site="site"
        scope="Global"
      />
    </DraggableLayout>
  </div>
</template>
