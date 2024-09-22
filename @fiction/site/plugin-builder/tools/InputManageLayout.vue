<script lang="ts" setup>
import type { EditorTool } from '@fiction/admin'
import type { vue } from '@fiction/core'
import type { Site } from '../../site'
import DraggableLayout from './LayoutDraggable.vue'
import LayoutToolRegion from './LayoutToolRegion.vue'

defineProps({
  site: { type: Object as vue.PropType<Site>, required: true },
  tool: { type: Object as vue.PropType<EditorTool>, required: true },
})
</script>

<template>
  <div class="list relative">
    <DraggableLayout class="relative rounded-md space-y-1.5" :site="site" @update:model-value="site.updateLayout({ order: $event })">
      <LayoutToolRegion scope="Page" region-id="main" :card="site.currentPage.value" :site="site" />
      <LayoutToolRegion
        v-for="(card, regionId) in site.sections.value"
        :key="regionId"
        :region-id="String(regionId)"
        :card
        :site="site"
        scope="Global"
      />
    </DraggableLayout>
  </div>
</template>
